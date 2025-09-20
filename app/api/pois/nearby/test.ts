const url = 'https://apis.data.go.kr/B551011/KorService2/locationBasedList2?serviceKey=YOUR_SERVICE_KEY&mapX=126.98375&mapY=37.563446&radius=100&MobileApp=AppTest&MobileOS=ETC&arrange=C&contentTypeId=39&modifiedtime=&_type=json&areaCode=1&sigunguCode=24&cat1=A05&cat2=A0502&cat3=A05020100&lDongRegnCd=11&lDongSignguCd=140&lclsSystm1=FD&lclsSystm2=FD01&lclsSystm3=FD010100';

fetch(url.replace('YOUR_SERVICE_KEY', 'R8KqK3WFsimh7fJrzqadqVDfMMOTp5TVf4soCDUGJAmOoi41fRZNTWC0JfrOjntRBiMIIhByHlKDjK%2BWPK9hIQ%3D%3D'))
  .then(res => res.json())
  .then((data: any) => {
    console.log('=== API 응답 전체 ===');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.response?.body?.items) {
      console.log('\n=== 관광지 목록 ===');
      data.response.body.items.forEach((item: any, index: number) => {
        console.log(`\n${index + 1}. ${item.title}`);
        console.log(`   주소: ${item.addr1 || '주소 없음'}`);
        console.log(`   좌표: ${item.mapx}, ${item.mapy}`);
        console.log(`   거리: ${item.dist}m`);
        console.log(`   이미지: ${item.firstimage || '이미지 없음'}`);
        console.log(`   콘텐츠ID: ${item.contentid}`);
      });
    }
  })
  .catch((err: any) => console.error('에러:', err));