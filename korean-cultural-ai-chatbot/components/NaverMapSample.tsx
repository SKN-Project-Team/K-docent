'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

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

interface PoiItem {
  id: string;
  title: string;
  lat: number;
  lng: number;
  address: string;
  distance: number;
  image: string | null;
  contentTypeId: string | null;
}

const MIN_RADIUS = 500;
const MAX_RADIUS = 2000;
const DEFAULT_RADIUS = 1000;

const formatDistance = (distance: number) => {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)}km`;
  }

  return `${distance}m`;
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

  const [userLocation, setUserLocation] = useState(center);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [pois, setPois] = useState<PoiItem[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLoadingPois, setIsLoadingPois] = useState(false);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);
  const [poiError, setPoiError] = useState<string | null>(null);

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
    (items: PoiItem[]) => {
      if (!window.naver || !window.naver.maps || !mapInstanceRef.current) {
        return;
      }

      const map = mapInstanceRef.current;
      clearMarkers();

      const newMarkers = items.map((poi) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(poi.lat, poi.lng),
          title: poi.title
        });

        if (window.naver.maps.Event && infoWindowRef.current) {
          window.naver.maps.Event.addListener(marker, 'click', () => {
            const content = `
              <div style="min-width: 220px; max-width: 240px; font-size: 13px;">
                <strong style="display: block; font-size: 14px; margin-bottom: 6px;">${poi.title}</strong>
                ${
                  poi.image
                    ? `<img src="${poi.image}" alt="${poi.title}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 6px; margin-bottom: 6px;" />`
                    : ''
                }
                <span style="display: block; margin-bottom: 4px; color: #2563eb; font-weight: 600;">${formatDistance(
                  poi.distance
                )}</span>
                <span style="display: block; color: #4b5563;">${poi.address}</span>
              </div>
            `;

            infoWindowRef.current.setContent(content);
            infoWindowRef.current.open(map, marker);
          });
        }

        return marker;
      });

      markersRef.current = newMarkers;

      if (!clustererRef.current) {
        clustererRef.current = new window.naver.maps.MarkerClustering({
          minClusterSize: 2,
          maxZoom: 15,
          map,
          markers: newMarkers,
          disableClickZoom: false,
          gridSize: 100,
          averageCenter: true
        });
      } else {
        if (typeof clustererRef.current.setMarkers === 'function') {
          clustererRef.current.setMarkers(newMarkers);
        } else if (typeof clustererRef.current.addMarkers === 'function') {
          clustererRef.current.clear && clustererRef.current.clear();
          clustererRef.current.addMarkers(newMarkers);
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
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=clusterer`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('네이버 지도 스크립트 로드 실패'));
        document.head.appendChild(script);
      });
    };

    const initializeMap = async () => {
      try {
        await loadNaverMapScript();

        if (mapContainerRef.current && window.naver && window.naver.maps) {
          const mapOptions = {
            center: new window.naver.maps.LatLng(center.lat, center.lng),
            zoom,
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

    initializeMap();

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
  }, [center.lat, center.lng, zoom, clientId, clearMarkers]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeolocationError('브라우저에서 위치 정보를 지원하지 않습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.warn('사용자 위치를 가져오지 못했습니다:', error);
        setGeolocationError('사용자 위치를 확인할 수 없어 기본 위치를 사용합니다.');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000 * 60 * 5
      }
    );
  }, []);

  useEffect(() => {
    if (!isMapReady || !window.naver || !window.naver.maps || !mapInstanceRef.current) {
      return;
    }

    const map = mapInstanceRef.current;
    const location = new window.naver.maps.LatLng(userLocation.lat, userLocation.lng);

    map.setCenter(location);

    if (!userMarkerRef.current) {
      userMarkerRef.current = new window.naver.maps.Marker({
        position: location,
        map,
        icon: {
          content:
            '<div style="background:#2563eb;color:#fff;padding:6px 8px;border-radius:9999px;font-size:12px;font-weight:700;">내 위치</div>',
          anchor: new window.naver.maps.Point(30, 30)
        }
      });
    } else {
      userMarkerRef.current.setPosition(location);
      if (!userMarkerRef.current.getMap()) {
        userMarkerRef.current.setMap(map);
      }
    }
  }, [isMapReady, userLocation]);

  useEffect(() => {
    if (!isMapReady || !userLocation) {
      return;
    }

    const controller = new AbortController();

    const fetchPois = async () => {
      setIsLoadingPois(true);
      setPoiError(null);

      try {
        const query = new URLSearchParams({
          lat: String(userLocation.lat),
          lng: String(userLocation.lng),
          radius: String(radius)
        });

        const response = await fetch(`/api/pois/nearby?${query.toString()}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data: PoiItem[] = await response.json();
        setPois(data);
        renderMarkers(data);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          return;
        }

        console.error('POI 데이터 요청 실패:', error);
        setPois([]);
        setPoiError('주변 관광지 정보를 불러오지 못했습니다.');
        clearMarkers();
      } finally {
        setIsLoadingPois(false);
      }
    };

    fetchPois();

    return () => {
      controller.abort();
    };
  }, [isMapReady, userLocation, radius, renderMarkers, clearMarkers]);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height
      }}
    >
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid #e5e7eb',
          borderRadius: '12px'
        }}
      />

      <div
        className="absolute top-4 left-4 bg-white shadow-lg rounded-lg p-4 w-72"
        style={{ zIndex: 10 }}
      >
        <h3 className="text-sm font-semibold text-gray-900 mb-2">반경 설정</h3>
        <input
          type="range"
          min={MIN_RADIUS}
          max={MAX_RADIUS}
          step={100}
          value={radius}
          onChange={(event) => setRadius(Number(event.target.value))}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-2">
          현재 반경: <span className="font-semibold text-blue-600">{formatDistance(radius)}</span>
        </div>
        {geolocationError && (
          <p className="text-xs text-amber-600 mt-2">{geolocationError}</p>
        )}
      </div>

      <div
        className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/90 backdrop-blur shadow-xl rounded-lg p-3 sm:p-4 max-w-sm"
        style={{ zIndex: 10 }}
      >
        <h3 className="text-sm font-semibold text-gray-900 mb-2">주변 관광지</h3>
        {isLoadingPois && <p className="text-sm text-gray-500">관광지 정보를 불러오는 중...</p>}
        {!isLoadingPois && poiError && (
          <p className="text-sm text-red-500">{poiError}</p>
        )}
        {!isLoadingPois && !poiError && pois.length === 0 && (
          <p className="text-sm text-gray-500">주변에 표시할 관광지가 없습니다.</p>
        )}
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {pois.map((poi) => (
            <div
              key={poi.id}
              className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-2 shadow-sm hover:border-blue-400 transition"
            >
              <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                {poi.image ? (
                  <img
                    src={poi.image}
                    alt={poi.title}
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
                <p className="text-sm font-semibold text-gray-900 truncate">{poi.title}</p>
                <p className="text-xs text-blue-600 font-medium mt-1">{formatDistance(poi.distance)}</p>
                <p className="text-xs text-gray-500 mt-1 break-words overflow-hidden">
                  {poi.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NaverMapSample;
