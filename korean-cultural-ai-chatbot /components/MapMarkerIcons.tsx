// 커스텀 마커 아이콘 SVG 컴포넌트들
export const PalaceMarkerIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#DC2626" stroke="white" strokeWidth="3"/>
    <text x="20" y="26" textAnchor="middle" fontSize="16" fill="white">🏯</text>
  </svg>
);

export const TempleMarkerIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#7C3AED" stroke="white" strokeWidth="3"/>
    <text x="20" y="26" textAnchor="middle" fontSize="16" fill="white">⛩️</text>
  </svg>
);

export const VillageMarkerIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#EA580C" stroke="white" strokeWidth="3"/>
    <text x="20" y="26" textAnchor="middle" fontSize="16" fill="white">🏘️</text>
  </svg>
);

export const CulturalStreetMarkerIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#0D9488" stroke="white" strokeWidth="3"/>
    <text x="20" y="26" textAnchor="middle" fontSize="16" fill="white">🎨</text>
  </svg>
);

export const UserLocationMarkerIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
    <circle cx="15" cy="15" r="12" fill="#3B82F6" stroke="white" strokeWidth="3"/>
    <circle cx="15" cy="15" r="6" fill="white"/>
    <circle cx="15" cy="15" r="3" fill="#3B82F6"/>
  </svg>
);

// SVG를 Data URL로 변환하는 헬퍼 함수
export const svgToDataUrl = (svgString: string): string => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
};

// 각 카테고리별 마커 이미지 생성
export const getMarkerImageUrl = (category: string): string => {
  let svgString = '';
  
  switch (category) {
    case '궁궐':
      svgString = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="#DC2626" stroke="white" stroke-width="3"/>
        <text x="20" y="26" text-anchor="middle" font-size="16" fill="white">🏯</text>
      </svg>`;
      break;
    case '사당':
      svgString = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="#7C3AED" stroke="white" stroke-width="3"/>
        <text x="20" y="26" text-anchor="middle" font-size="16" fill="white">⛩️</text>
      </svg>`;
      break;
    case '마을':
      svgString = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="#EA580C" stroke="white" stroke-width="3"/>
        <text x="20" y="26" text-anchor="middle" font-size="16" fill="white">🏘️</text>
      </svg>`;
      break;
    case '문화거리':
      svgString = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="#0D9488" stroke="white" stroke-width="3"/>
        <text x="20" y="26" text-anchor="middle" font-size="16" fill="white">🎨</text>
      </svg>`;
      break;
    default:
      svgString = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="#6B7280" stroke="white" stroke-width="3"/>
        <text x="20" y="26" text-anchor="middle" font-size="16" fill="white">📍</text>
      </svg>`;
  }
  
  return svgToDataUrl(svgString);
};

export const getUserLocationMarkerUrl = (): string => {
  const svgString = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none">
    <circle cx="15" cy="15" r="12" fill="#3B82F6" stroke="white" stroke-width="3"/>
    <circle cx="15" cy="15" r="6" fill="white"/>
    <circle cx="15" cy="15" r="3" fill="#3B82F6"/>
  </svg>`;
  
  return svgToDataUrl(svgString);
};