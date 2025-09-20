'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGeolocation, useNearbyHeritage } from '@/lib/api/hooks';
import { useApp } from '@/context/AppContext';

// 네이버 지도 타입 정의
declare global {
  interface Window {
    naver: any;
  }
}

interface NaverMapSampleProps {
  width?: string;
  height?: string;
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  clientId: string;
}

interface HeritageItem {
  content_id: number;
  site_id: number;
  language: string;
  name: string;
  description_summary: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  image_url?: string;
  has_tts_audio: boolean;
}

const FIXED_RADIUS_KM = 10;

const formatDistance = (distance_km: number) => {
  if (distance_km < 1) {
    return `${Math.round(distance_km * 1000)}m`;
  }
  return `${distance_km.toFixed(1)}km`;
};

const NaverMapSample: React.FC<NaverMapSampleProps> = ({
  width = '100%',
  height = '400px',
  center = { lat: 37.3595704, lng: 127.105399 },
  zoom = 13,
  clientId
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const clustererRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);

  const { userProfile } = useApp();
  const { location, loading: locationLoading, error: locationError } = useGeolocation();
  const { heritage, loading: heritageLoading, error: heritageError } = useNearbyHeritage(
    location ? {
      latitude: location.lat,
      longitude: location.lng,
      radius_km: FIXED_RADIUS_KM,
      language: userProfile.language || 'ko',
      limit: 50
    } : undefined
  );

  const [isMapReady, setIsMapReady] = useState(false);
  const [hasInitialLocationSet, setHasInitialLocationSet] = useState(false);
  const userLocation = location || center;

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => {
      if (marker && typeof marker.setMap === 'function') {
        marker.setMap(null);
      }
    });
    markersRef.current = [];

    if (clustererRef.current) {
      if (typeof clustererRef.current.clear === 'function') {
        clustererRef.current.clear();
      } else if (typeof clustererRef.current.setMarkers === 'function') {
        clustererRef.current.setMarkers([]);
      }
    }
  }, []);

  const renderMarkers = useCallback(
    (items: HeritageItem[]) => {
      if (!window.naver || !window.naver.maps || !mapInstanceRef.current) {
        return;
      }

      const map = mapInstanceRef.current;
      clearMarkers();

      const newMarkers = items.map((heritage) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(heritage.latitude, heritage.longitude),
          title: heritage.name
        });

        if (window.naver.maps.Event && infoWindowRef.current) {
          window.naver.maps.Event.addListener(marker, 'click', () => {
            const content = `
              <div style="min-width: 220px; max-width: 240px; font-size: 13px;">
                <strong style="display: block; font-size: 14px; margin-bottom: 6px;">${heritage.name}</strong>
                ${
                  heritage.image_url
                    ? `<img src="${heritage.image_url}" alt="${heritage.name}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 6px; margin-bottom: 6px;" />`
                    : ''
                }
                <span style="display: block; margin-bottom: 4px; color: #2563eb; font-weight: 600;">${formatDistance(
                  heritage.distance_km
                )}</span>
                <span style="display: block; color: #4b5563;">${heritage.description_summary}</span>
                ${heritage.has_tts_audio ? '<span style="display: inline-block; background: #3b82f6; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-top: 4px;">음성해설</span>' : ''}
              </div>
            `;

            infoWindowRef.current.setContent(content);
            infoWindowRef.current.open(map, marker);
          });
        }

        return marker;
      });

      markersRef.current = newMarkers;

      // MarkerClustering 생성자 확인 및 안전한 초기화
      if (!clustererRef.current) {
        try {
          // 네이버 지도 API v3에서 MarkerClustering 생성자 확인
          if (window.naver.maps.MarkerClustering) {
            clustererRef.current = new window.naver.maps.MarkerClustering({
              minClusterSize: 2,
              maxZoom: 15,
              map,
              markers: newMarkers,
              disableClickZoom: false,
              gridSize: 100,
              averageCenter: true
            });
          } else if (window.naver.maps.clustering && window.naver.maps.clustering.MarkerClustering) {
            // 대안적인 경로로 시도
            clustererRef.current = new window.naver.maps.clustering.MarkerClustering({
              minClusterSize: 2,
              maxZoom: 15,
              map,
              markers: newMarkers,
              disableClickZoom: false,
              gridSize: 100,
              averageCenter: true
            });
          } else {
            console.warn('MarkerClustering을 사용할 수 없습니다. 개별 마커로 표시합니다.');
            // 클러스터링 없이 개별 마커만 지도에 표시
            newMarkers.forEach(marker => marker.setMap(map));
          }
        } catch (error) {
          console.error('MarkerClustering 초기화 실패:', error);
          console.warn('클러스터링 없이 개별 마커로 표시합니다.');
          // 클러스터링 실패 시 개별 마커만 지도에 표시
          newMarkers.forEach(marker => marker.setMap(map));
        }
      } else {
        if (typeof clustererRef.current.setMarkers === 'function') {
          clustererRef.current.setMarkers(newMarkers);
        } else if (typeof clustererRef.current.addMarkers === 'function') {
          clustererRef.current.clear && clustererRef.current.clear();
          clustererRef.current.addMarkers(newMarkers);
        } else {
          // 클러스터링 업데이트 실패 시 개별 마커로 표시
          newMarkers.forEach(marker => marker.setMap(map));
        }
      }
    },
    [clearMarkers]
  );

  useEffect(() => {
    const loadNaverMapScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (typeof window === 'undefined') {
          reject(new Error('window is undefined'));
          return;
        }

        if (window.naver && window.naver.maps) {
          resolve();
          return;
        }

        const existingScript = document.querySelector<HTMLScriptElement>(
          'script[src*="oapi.map.naver.com"]'
        );

        if (existingScript) {
          existingScript.addEventListener('load', () => resolve());
          existingScript.addEventListener('error', reject);
          return;
        }

        const script = document.createElement('script');
        script.type = 'text/javascript';
        // clusterer 서브모듈을 명시적으로 로드
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=clusterer`;
        script.async = true;
        script.onload = () => {
          // 스크립트 로드 후 MarkerClustering 사용 가능 여부 확인
          setTimeout(() => {
            if (window.naver && window.naver.maps) {
              console.log('네이버 지도 API 로드 완료');
              console.log('MarkerClustering 사용 가능:', !!window.naver.maps.MarkerClustering);
              resolve();
            } else {
              reject(new Error('네이버 지도 API 로드 실패'));
            }
          }, 100);
        };
        script.onerror = () => reject(new Error('네이버 지도 스크립트 로드 실패'));
        document.head.appendChild(script);
      });
    };

    const initializeMap = async () => {
      try {
        await loadNaverMapScript();

        if (mapContainerRef.current && window.naver && window.naver.maps) {
          // 사용자 위치가 있으면 그것을 사용하고, 없으면 기본 위치 사용
          const mapCenter = userLocation.lat !== center.lat || userLocation.lng !== center.lng 
            ? userLocation 
            : center;

          const mapOptions = {
            center: new window.naver.maps.LatLng(mapCenter.lat, mapCenter.lng),
            zoom: location ? 15 : zoom, // GPS 위치가 있으면 더 높은 줌 레벨로 포커싱
            mapTypeControl: true,
            mapTypeControlOptions: {
              style: window.naver.maps.MapTypeControlStyle.BUTTON,
              position: window.naver.maps.Position.TOP_RIGHT
            },
            zoomControl: true,
            zoomControlOptions: {
              style: window.naver.maps.ZoomControlStyle.LARGE,
              position: window.naver.maps.Position.TOP_LEFT
            }
          };

          mapInstanceRef.current = new window.naver.maps.Map(
            mapContainerRef.current,
            mapOptions
          );

          infoWindowRef.current = new window.naver.maps.InfoWindow({
            anchorSkew: true
          });

          if (window.naver.maps.Event) {
            window.naver.maps.Event.addListener(mapInstanceRef.current, 'click', () => {
              infoWindowRef.current?.close();
            });
          }

          setIsMapReady(true);
        }
      } catch (error) {
        console.error('네이버 지도 초기화 실패:', error);
      }
    };

    // 사용자 위치가 설정된 후에 지도 초기화
    if (userLocation) {
      initializeMap();
    }

    return () => {
      clearMarkers();
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
      if (clustererRef.current) {
        if (typeof clustererRef.current.setMap === 'function') {
          clustererRef.current.setMap(null);
        }
        clustererRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation, zoom, clientId, clearMarkers]);


  useEffect(() => {
    if (!isMapReady || !window.naver || !window.naver.maps || !mapInstanceRef.current) {
      return;
    }

    const map = mapInstanceRef.current;
    const location = new window.naver.maps.LatLng(userLocation.lat, userLocation.lng);

    // GPS 위치가 처음 감지된 경우에만 포커싱
    if (!hasInitialLocationSet && userLocation.lat !== center.lat && userLocation.lng !== center.lng) {
      map.morph(location, 15, {
        duration: 1000,
        easing: 'easeOutCubic'
      });
      setHasInitialLocationSet(true);
    } else if (!hasInitialLocationSet) {
      // GPS 위치가 아직 감지되지 않은 경우 중심만 설정
      map.setCenter(location);
    }

    if (!userMarkerRef.current) {
      userMarkerRef.current = new window.naver.maps.Marker({
        position: location,
        map,
        icon: {
          content: `
            <div style="
              position: relative;
              width: 20px;
              height: 20px;
              background: #3b82f6;
              border: 3px solid #fff;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              <div style="
                position: absolute;
                top: -35px;
                left: 50%;
                transform: translateX(-50%);
                background: #1e40af;
                color: #fff;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                white-space: nowrap;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
              ">
                📍 내 위치
              </div>
            </div>
          `,
          anchor: new window.naver.maps.Point(10, 10)
        },
        zIndex: 1000
      });
    } else {
      userMarkerRef.current.setPosition(location);
      if (!userMarkerRef.current.getMap()) {
        userMarkerRef.current.setMap(map);
      }
    }
  }, [isMapReady, userLocation, hasInitialLocationSet, center]);

  useEffect(() => {
    if (!isMapReady || !heritage?.results) {
      return;
    }

    renderMarkers(heritage.results);
  }, [isMapReady, heritage, renderMarkers]);

  return (
    <div className="flex flex-col lg:flex-row gap-4" style={{ width, height }}>
      {/* 지도 영역 */}
      <div className="flex-1" style={{ minHeight: '400px' }}>
        <div
          ref={mapContainerRef}
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid #e5e7eb',
            borderRadius: '12px'
          }}
        />
      </div>

      {/* 사이드 패널 영역 */}
      <div className="w-full lg:w-80 flex flex-col gap-4" style={{ maxHeight: height }}>
        {/* 위치 정보 패널 */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">검색 범위</h3>
          <div className="text-sm text-gray-600">
            반경: <span className="font-semibold text-blue-600">{FIXED_RADIUS_KM}km</span>
          </div>
          {locationError && (
            <p className="text-xs text-amber-600 mt-2">{locationError}</p>
          )}
          {locationLoading && (
            <p className="text-xs text-gray-500 mt-2">위치 정보를 가져오는 중...</p>
          )}
        </div>

        {/* 주변 문화재 패널 */}
        <div className="bg-white/90 backdrop-blur shadow-xl rounded-lg p-3 sm:p-4 flex-1 overflow-hidden">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">주변 문화재</h3>
          {heritageLoading && <p className="text-sm text-gray-500">문화재 정보를 불러오는 중...</p>}
          {!heritageLoading && heritageError && (
            <p className="text-sm text-red-500">{heritageError.getUserFriendlyMessage()}</p>
          )}
          {!heritageLoading && !heritageError && (!heritage?.results || heritage.results.length === 0) && (
            <p className="text-sm text-gray-500">주변에 표시할 문화재가 없습니다.</p>
          )}
          <div className="space-y-3 h-full overflow-y-auto pr-1">
            {heritage?.results?.map((heritageItem) => (
              <div
                key={heritageItem.content_id}
                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-2 shadow-sm hover:border-blue-400 transition cursor-pointer"
                onClick={() => {
                  // 상세 페이지로 이동
                  window.location.href = `/detail/${heritageItem.content_id}`;
                }}
              >
                <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                  {heritageItem.image_url ? (
                    <img
                      src={heritageItem.image_url}
                      alt={heritageItem.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      이미지 없음
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{heritageItem.name}</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">{formatDistance(heritageItem.distance_km)}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {heritageItem.description_summary}
                  </p>
                  {heritageItem.has_tts_audio && (
                    <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded mt-1">
                      음성해설
                    </span>
                  )}
                </div>
              </div>
            )) || []}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NaverMapSample;
