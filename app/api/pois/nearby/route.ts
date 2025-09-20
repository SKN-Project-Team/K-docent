import { NextRequest, NextResponse } from 'next/server';

type TourApiItem = {
  contentid: string;
  contenttypeid?: string;
  title: string;
  addr1?: string;
  firstimage?: string;
  firstimage2?: string;
  mapx: string; // lng
  mapy: string; // lat
  dist?: string; // meters as string
};

type PoiItem = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  address: string;
  distance: number; // meters
  image: string | null;
  contentTypeId: string | null;
};

function toNumber(n: unknown) {
  const x = typeof n === 'string' ? parseFloat(n) : NaN;
  return Number.isFinite(x) ? x : NaN;
}

// Haversine (meter)
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const radius = Math.max(100, Math.min(20000, parseInt(searchParams.get('radius') || '1000', 10)));
    const contentTypeId = searchParams.get('contentTypeId') || ''; // 옵션

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return new NextResponse('lat/lng required', { status: 400 });
    }

    const serviceKey = process.env.TOURAPI_SERVICE_KEY;
    if (!serviceKey) {
      return new NextResponse('TOURAPI_SERVICE_KEY not set', { status: 500 });
    }

    // 서비스 키를 직접 URL에 포함 (이중 인코딩 방지)
    const baseUrl = 'https://apis.data.go.kr/B551011/KorService2/locationBasedList2';
    const params = new URLSearchParams({
      MobileOS: 'ETC',
      MobileApp: 'K-Docent',
      _type: 'json',
      mapX: String(lng),       // 경도
      mapY: String(lat),       // 위도
      radius: String(radius),  // 미터
      // listYN: 'Y',
      arrange: 'C',            // 수정일 최신순 (거리값은 응답에 포함됨)
      numOfRows: '100',
      pageNo: '1'
    });
    if (contentTypeId) params.set('contentTypeId', contentTypeId);

    const url = `${baseUrl}?serviceKey=${serviceKey}&${params.toString()}`;
    console.log('TourAPI 요청 URL:', url);
    
    const res = await fetch(url, { next: { revalidate: 60 } });
    
    const responseText = await res.text();
    console.log('TourAPI 응답 상태:', res.status);
    console.log('TourAPI 응답 헤더:', Object.fromEntries(res.headers.entries()));
    console.log('TourAPI 응답 내용 (처음 500자):', responseText.substring(0, 500));
    
    if (!res.ok) {
      return new NextResponse(`TourAPI error (${res.status}): ${responseText}`, { status: 502 });
    }

    // JSON 파싱 시도
    let json;
    try {
      json = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON 파싱 실패:', parseError);
      return new NextResponse(`Invalid JSON response from TourAPI: ${responseText.substring(0, 200)}`, { status: 502 });
    }

    // API 응답 구조 확인
    if (json?.response?.header?.resultCode !== '0000') {
      const errorMsg = json?.response?.header?.resultMsg || 'Unknown API error';
      console.error('TourAPI 오류:', json?.response?.header);
      return new NextResponse(`TourAPI error: ${errorMsg}`, { status: 502 });
    }

    const items: TourApiItem[] = json?.response?.body?.items?.item ?? [];

    const pois: PoiItem[] = items.map((it) => {
      const itemLat = toNumber(it.mapy);
      const itemLng = toNumber(it.mapx);
      const distFromApi = it.dist ? parseFloat(it.dist) : NaN;
      const distance = Number.isFinite(distFromApi)
        ? Math.round(distFromApi)
        : Math.round(haversine(lat, lng, itemLat, itemLng));

      return {
        id: it.contentid,
        title: it.title,
        lat: itemLat,
        lng: itemLng,
        address: it.addr1 || '',
        distance,
        image: it.firstimage || it.firstimage2 || null,
        contentTypeId: it.contenttypeid || null
      };
    })
    // 반경 밖으로 내려오는 항목이 섞일 수 있어 한 번 더 필터
    .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng) && p.distance <= radius)
    // 가까운 순 정렬
    .sort((a, b) => a.distance - b.distance);

    return NextResponse.json(pois);
  } catch (err: any) {
    console.error('API 라우트 오류:', err);
    return new NextResponse(err?.message || 'Internal Error', { status: 500 });
  }
}
