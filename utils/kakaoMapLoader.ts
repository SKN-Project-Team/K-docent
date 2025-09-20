export const loadKakaoMapScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 로드되어 있는 경우
    if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    // 서버 사이드에서 실행되는 경우 처리
    if (typeof window === 'undefined') {
      reject(new Error('Window is not available'));
      return;
    }

    // 스크립트가 이미 DOM에 있는지 확인
    const existingScript = document.getElementById('kakao-map-script');
    if (existingScript) {
      // 기존 스크립트가 로딩 완료되기를 기다림
      if (window.kakao && window.kakao.maps) {
        resolve();
      } else {
        // 기존 스크립트의 로딩을 기다림
        const checkKakao = setInterval(() => {
          if (window.kakao && window.kakao.maps) {
            clearInterval(checkKakao);
            window.kakao.maps.load(() => resolve());
          }
        }, 100);
        
        // 10초 후 타임아웃
        setTimeout(() => {
          clearInterval(checkKakao);
          reject(new Error('Kakao Map script loading timeout'));
        }, 10000);
      }
      return;
    }

    // 새 스크립트 태그 생성
    const script = document.createElement('script');
    script.id = 'kakao-map-script';
    script.type = 'text/javascript';
    
    // API 키 설정 - 클라이언트에서 직접 값 사용
    const apiKey = 'bd00007a36c6b96dfd8c03957cf295ba';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    
    script.onload = () => {
      // 스크립트 로딩 후 kakao 객체가 생성되기까지 기다림
      const checkKakao = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkKakao);
          window.kakao.maps.load(() => resolve());
        }
      }, 100);

      // 10초 후 타임아웃
      setTimeout(() => {
        clearInterval(checkKakao);
        reject(new Error('Kakao maps API not available after loading'));
      }, 10000);
    };

    script.onerror = () => {
      reject(new Error('Failed to load Kakao Map script'));
    };

    document.head.appendChild(script);
  });
};

export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        // 위치를 가져올 수 없는 경우 서울 중심부 좌표로 기본값 설정
        console.warn('Could not get user location:', error.message);
        resolve({
          lat: 37.5665, // 서울시청 위도
          lng: 126.9780  // 서울시청 경도
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};