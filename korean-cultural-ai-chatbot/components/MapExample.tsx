'use client';

import React from 'react';
import NaverMapSample from './NaverMapSample';

const MapExample: React.FC = () => {
  // 실제 네이버 클라우드 플랫폼에서 발급받은 Client ID를 사용하세요
  const CLIENT_ID = 'nqej2pqxek'; // 실제 클라이언트 ID로 변경 필요

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">지도</h1>
      
      {/* 기본 지도 */}
      <div className="mb-3">
        <NaverMapSample 
          clientId={CLIENT_ID}
          width="100%"
          height="400px"
        />
      </div>
    </div>
  );
};

export default MapExample;