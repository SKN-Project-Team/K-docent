import { NextRequest, NextResponse } from 'next/server';

// 축제 API 응답 타입 정의
type FestivalApiItem = {
  contentid: string;
  contenttypeid: string;
  title: string;
  addr1?: string;
  addr2?: string;
  areacode?: string;
  sigungucode?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  eventstartdate: string;
  eventenddate: string;
  firstimage?: string;
  firstimage2?: string;
  mapx?: string;
  mapy?: string;
  tel?: string;
  modifiedtime: string;
  createdtime: string;
};

type FestivalItem = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  address: string;
  phone?: string;
  image?: string;
  thumbnailImage?: string;
  lat?: number;
  lng?: number;
  category: string;
  areaCode?: string;
  distance?: number;
  isOngoing: boolean;
  daysUntilStart?: number;
  daysUntilEnd?: number;
};

function toNumber(n: unknown) {
  const x = typeof n === 'string' ? parseFloat(n) : NaN;
  return Number.isFinite(x) ? x : NaN;
}

// Haversine 거리 계산 (미터)
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

// 날짜 문자열을 Date 객체로 변환 (YYYYMMDD 형식)
function parseApiDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.length !== 8) return null;
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1; // 월은 0부터 시작
  const day = parseInt(dateStr.substring(6, 8));
  return new Date(year, month, day);
}

// 오늘 날짜와 비교하여 진행 상태 확인
function getFestivalStatus(startDate: string, endDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const start = parseApiDate(startDate);
  const end = parseApiDate(endDate);
  
  if (!start || !end) {
    return { isOngoing: false, daysUntilStart: undefined, daysUntilEnd: undefined };
  }

  const startTime = start.getTime();
  const endTime = end.getTime();
  const todayTime = today.getTime();

  const isOngoing = todayTime >= startTime && todayTime <= endTime;
  const daysUntilStart = Math.ceil((startTime - todayTime) / (1000 * 60 * 60 * 24));
  const daysUntilEnd = Math.ceil((endTime - todayTime) / (1000 * 60 * 60 * 24));

  return {
    isOngoing,
    daysUntilStart: daysUntilStart > 0 ? daysUntilStart : undefined,
    daysUntilEnd: isOngoing && daysUntilEnd > 0 ? daysUntilEnd : undefined
  };
}

// 카테고리 코드를 한글로 변환
function getCategoryName(cat1?: string, cat2?: string): string {
  const categories: { [key: string]: string } = {
    'A02': '문화시설',
    'A0207': '축제',
    'A0208': '공연/행사',
    'A02070200': '문화관광축제',
    'A02080100': '문화공연',
    'A02080200': '연극',
    'A02080300': '뮤지컬',
    'A02080400': '오페라',
    'A02080500': '전시회',
    'A02081300': '기타행사'
  };
  
  return categories[cat2 || ''] || categories[cat1 || ''] || '행사/축제';
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const radius = Math.max(1000, Math.min(50000, parseInt(searchParams.get('radius') || '10000', 10)));
    const areaCode = searchParams.get('areaCode') || '';
    const sigunguCode = searchParams.get('sigunguCode') || '';
    const maxResults = Math.min(50, parseInt(searchParams.get('maxResults') || '20', 10));
    const includePast = searchParams.get('includePast') === 'true'; // 과거 행사 포함 여부
    
    const serviceKey = process.env.TOURAPI_SERVICE_KEY;
    if (!serviceKey) {
      return new NextResponse('TOURAPI_SERVICE_KEY not set', { status: 500 });
    }

    // 현재 날짜부터 3개월 후까지의 행사 검색
    const today = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(today.getMonth() + 3);
    
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    const eventStartDate = includePast 
      ? formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)) // 1개월 전부터
      : formatDate(today); // 오늘부터
    const eventEndDate = formatDate(threeMonthsLater);

    const baseUrl = 'https://apis.data.go.kr/B551011/KorService2/searchFestival2';
    const params = new URLSearchParams({
      MobileOS: 'ETC',
      MobileApp: 'K-Docent',
      _type: 'json',
      eventStartDate,
      eventEndDate,
      arrange: 'C', // 수정일순 (최신순)
      numOfRows: String(maxResults * 2), // 필터링을 고려해 더 많이 가져옴
      pageNo: '1'
    });

    if (areaCode) params.set('areaCode', areaCode);
    if (sigunguCode) params.set('sigunguCode', sigunguCode);

    const url = `${baseUrl}?serviceKey=${serviceKey}&${params.toString()}`;
    console.log('축제 API 요청 URL:', url);
    
    const res = await fetch(url, { next: { revalidate: 300 } }); // 5분 캐시
    
    const responseText = await res.text();
    console.log('축제 API 응답 상태:', res.status);
    
    if (!res.ok) {
      return new NextResponse(`Festival API error (${res.status}): ${responseText}`, { status: 502 });
    }

    let json;
    try {
      json = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON 파싱 실패:', parseError);
      return new NextResponse(`Invalid JSON response from Festival API: ${responseText.substring(0, 200)}`, { status: 502 });
    }

    if (json?.response?.header?.resultCode !== '0000') {
      const errorMsg = json?.response?.header?.resultMsg || 'Unknown API error';
      console.error('축제 API 오류:', json?.response?.header);
      return new NextResponse(`Festival API error: ${errorMsg}`, { status: 502 });
    }

    const items: FestivalApiItem[] = json?.response?.body?.items?.item ?? [];

    let festivals: FestivalItem[] = items.map((item) => {
      const itemLat = toNumber(item.mapy);
      const itemLng = toNumber(item.mapx);
      const status = getFestivalStatus(item.eventstartdate, item.eventenddate);
      
      let distance: number | undefined;
      if (Number.isFinite(lat) && Number.isFinite(lng) && Number.isFinite(itemLat) && Number.isFinite(itemLng)) {
        distance = Math.round(haversine(lat, lng, itemLat, itemLng));
      }

      return {
        id: item.contentid,
        title: item.title,
        description: item.addr1 || '행사 상세 정보',
        startDate: item.eventstartdate,
        endDate: item.eventenddate,
        address: [item.addr1, item.addr2].filter(Boolean).join(' '),
        phone: item.tel,
        image: item.firstimage,
        thumbnailImage: item.firstimage2,
        lat: Number.isFinite(itemLat) ? itemLat : undefined,
        lng: Number.isFinite(itemLng) ? itemLng : undefined,
        category: getCategoryName(item.cat1, item.cat2),
        areaCode: item.areacode,
        distance,
        ...status
      };
    });

    // 거리 기반 필터링 (위치 정보가 있는 경우)
    if (Number.isFinite(lat) && Number.isFinite(lng) && radius > 0) {
      festivals = festivals.filter(festival => 
        !festival.distance || festival.distance <= radius
      );
    }

    // 정렬: 진행 중인 행사 > 가까운 날짜 순 > 거리 순
    festivals.sort((a, b) => {
      // 1. 진행 중인 행사 우선
      if (a.isOngoing && !b.isOngoing) return -1;
      if (!a.isOngoing && b.isOngoing) return 1;
      
      // 2. 시작까지 남은 날짜 순 (가까운 것부터)
      if (a.daysUntilStart && b.daysUntilStart) {
        return a.daysUntilStart - b.daysUntilStart;
      }
      if (a.daysUntilStart && !b.daysUntilStart) return -1;
      if (!a.daysUntilStart && b.daysUntilStart) return 1;
      
      // 3. 거리 순 (가까운 것부터)
      if (a.distance && b.distance) {
        return a.distance - b.distance;
      }
      if (a.distance && !b.distance) return -1;
      if (!a.distance && b.distance) return 1;
      
      return 0;
    });

    // 최대 결과 수 제한
    festivals = festivals.slice(0, maxResults);

    const summary = {
      total: festivals.length,
      ongoing: festivals.filter(f => f.isOngoing).length,
      upcoming: festivals.filter(f => !f.isOngoing && f.daysUntilStart).length,
      searchRadius: radius,
      searchCenter: Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null
    };

    return NextResponse.json({
      festivals,
      summary
    });

  } catch (err: any) {
    console.error('축제 API 라우트 오류:', err);
    return new NextResponse(err?.message || 'Internal Error', { status: 500 });
  }
}
