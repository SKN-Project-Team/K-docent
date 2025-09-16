'use client';

import React from 'react';
import NaverMapSample from './NaverMapSample';

const MapExample: React.FC = () => {
  // 실제 네이버 클라우드 플랫폼에서 발급받은 Client ID를 사용하세요
  const CLIENT_ID = 'nqej2pqxek'; // 실제 클라이언트 ID로 변경 필요

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">네이버 지도 샘플</h1>
      
      {/* 기본 지도 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">기본 지도</h2>
        <NaverMapSample 
          clientId={CLIENT_ID}
          width="100%"
          height="400px"
        />
      </div>

      {/* 커스텀 설정 지도 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">커스텀 설정 지도 (강남역)</h2>
        <NaverMapSample 
          clientId={CLIENT_ID}
          center={{ lat: 37.4979, lng: 127.0276 }}
          zoom={15}
          width="100%"
          height="300px"
        />
      </div>

      {/* 작은 크기 지도 */}
      <div>
        <h2 className="text-lg font-semibold mb-2">작은 크기 지도</h2>
        <NaverMapSample 
          clientId={CLIENT_ID}
          center={{ lat: 37.5665, lng: 126.9780 }} // 서울시청
          zoom={12}
          width="400px"
          height="250px"
        />
      </div>
    </div>
  );
};

export default MapExample;