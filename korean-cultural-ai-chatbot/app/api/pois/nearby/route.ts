import { NextRequest, NextResponse } from 'next/server';

interface TourApiItem {
  contentid?: string;
  contenttypeid?: string;
  title?: string;
  firstimage?: string;
  firstimage2?: string;
  mapx?: string;
  mapy?: string;
  addr1?: string;
  addr2?: string;
  dist?: string;
}

const DEFAULT_RADIUS = 1000; // meters

const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371000; // Earth radius in meters
  const toRad = (value: number) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius');
  const types = searchParams.get('types');

  if (!lat || !lng) {
    return NextResponse.json(
      { message: 'lat과 lng 파라미터가 필요합니다.' },
      { status: 400 }
    );
  }

  const serviceKey = process.env.KTO_TOUR_API_KEY;

  if (!serviceKey) {
    console.error('KTO_TOUR_API_KEY 환경 변수가 설정되어 있지 않습니다.');
    return NextResponse.json(
      { message: 'TourAPI 서비스 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    const serviceKeyParam = serviceKey.includes('%')
      ? decodeURIComponent(serviceKey)
      : serviceKey;

    const params = new URLSearchParams({
      serviceKey: serviceKeyParam,
      numOfRows: '100',
      pageNo: '1',
      MobileOS: 'ETC',
      MobileApp: 'K-Docent',
      _type: 'json',
      mapX: lng,
      mapY: lat,
      radius: radius ?? String(DEFAULT_RADIUS)
    });

    if (types) {
      const [contentTypeId] = types.split(',');
      if (contentTypeId) {
        params.set('contentTypeId', contentTypeId);
      }
    }

    const endpoint = `https://apis.data.go.kr/B551011/KorService1/locationBasedList1?${params.toString()}`;
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('TourAPI 요청 실패', response.status, await response.text());
      return NextResponse.json(
        { message: 'TourAPI 요청 중 오류가 발생했습니다.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const items: TourApiItem[] =
      data?.response?.body?.items?.item
        ? Array.isArray(data.response.body.items.item)
          ? data.response.body.items.item
          : [data.response.body.items.item]
        : [];

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    const pois = items
      .map((item) => {
        const poiLat = item.mapy ? parseFloat(item.mapy) : undefined;
        const poiLng = item.mapx ? parseFloat(item.mapx) : undefined;

        if (!poiLat || !poiLng) {
          return null;
        }

        const distance = item.dist
          ? Math.round(parseFloat(item.dist))
          : haversineDistance(parsedLat, parsedLng, poiLat, poiLng);

        return {
          id: item.contentid ?? `${poiLat}-${poiLng}`,
          title: item.title ?? '이름 미상',
          lat: poiLat,
          lng: poiLng,
          address: item.addr1 ?? item.addr2 ?? '주소 정보 없음',
          distance,
          image: item.firstimage || item.firstimage2 || null,
          contentTypeId: item.contenttypeid ?? null
        };
      })
      .filter((poi): poi is NonNullable<typeof poi> => poi !== null)
      .sort((a, b) => a.distance - b.distance);

    return NextResponse.json(pois);
  } catch (error) {
    console.error('TourAPI 데이터 파싱 실패', error);
    return NextResponse.json(
      { message: '관광지 데이터를 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}
