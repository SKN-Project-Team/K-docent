"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Globe, Crosshair, Loader2 } from "lucide-react"
import { LocationData } from "@/types"

interface MapScreenProps {
  culturalSites: LocationData[]
  userProfile: {
    language: string
    level: string
    interests: string[]
  }
  onLocationSelect: (location: LocationData) => void
  onLanguageChange: (lang: string) => void
}

declare global {
  interface Window {
    ol: any
    vw: any
  }
}

export default function MapScreen({
  culturalSites,
  userProfile,
  onLocationSelect,
  onLanguageChange
}: MapScreenProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isMapLoading, setIsMapLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState("지도를 불러오는 중...")

  // 서울 중심부 좌표 (기본값)
  const seoulCenter = { lat: 37.5665, lng: 126.9780 }

  useEffect(() => {
    // 사용자 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.warn('Could not get user location:', error.message)
          setUserLocation(seoulCenter)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    } else {
      setUserLocation(seoulCenter)
    }
  }, [])

  useEffect(() => {
    console.log('MapScreen useEffect triggered')
    console.log('userLocation:', userLocation)
    console.log('mapRef.current:', mapRef.current)
    
    if (!userLocation || !mapRef.current) {
      console.log('Early return: missing userLocation or mapRef')
      return
    }

    // VWorld API를 비동기로 로드
    const loadVWorldAPI = () => {
      console.log('loadVWorldAPI called')
      
      // 이미 로드되어 있는지 확인
      if (typeof window !== 'undefined' && window.vw && window.ol) {
        console.log('VWorld API already loaded')
        return Promise.resolve()
      }

      console.log('Loading VWorld API asynchronously...')
      setLoadingMessage("VWorld API 로드 중...")

      // 기존 스크립트 제거
      const existingScripts = document.querySelectorAll('script[src*="vworldMapInit.js"]')
      existingScripts.forEach(script => script.remove())

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://map.vworld.kr/js/vworldMapInit.js.do?version=2.0&apiKey=3EB4149F-00ED-3BB6-B068-B4D71687BDF6'
        script.async = true
        script.type = 'text/javascript'
        
        console.log('Creating script with src:', script.src)
        
        script.onload = () => {
          console.log('VWorld API script loaded successfully')
          console.log('window.vw available:', !!(window as any).vw)
          console.log('window.ol available:', !!(window as any).ol)
          resolve()
        }
        
        script.onerror = (error) => {
          console.error('Failed to load VWorld API script:', error)
          reject(new Error('VWorld API 로드 실패'))
        }
        
        console.log('Adding script to document head')
        document.head.appendChild(script)
      })
    }

    const initializeVWorldMap = async () => {
      try {
        // VWorld API 로드 대기
        await loadVWorldAPI()
        
        setLoadingMessage("VWorld 지도 생성 중...")
        console.log('Initializing VWorld map...')
        
        // 지도 컨테이너 ID 설정
        if (mapRef.current) {
          mapRef.current.id = 'vworldMap'
        }
        
        // VWorld 지도 옵션 설정
        window.vw.ol3.MapOptions = {
          basemapType: window.vw.ol3.BasemapType.GRAPHIC,
          controlDensity: window.vw.ol3.DensityType.EMPTY,
          interactionDensity: window.vw.ol3.DensityType.BASIC,
          controlsAutoArrange: true,
          homePosition: window.vw.ol3.CameraPosition,
          initPosition: window.vw.ol3.CameraPosition
        }

        // VWorld 지도 생성
        console.log('Creating VWorld map...')
        const vworldMap = new window.vw.ol3.Map('vworldMap', window.vw.ol3.MapOptions)
        
        if (vworldMap) {
          console.log('VWorld map created successfully:', vworldMap)
          setMap(vworldMap)
          setIsMapLoading(false)
          setLoadingMessage("")
          
          // 사용자 위치로 지도 이동 및 마커 추가
          setTimeout(() => {
            if (userLocation) {
              const center = [userLocation.lng, userLocation.lat]
              vworldMap.getView().setCenter(center)
              vworldMap.getView().setZoom(13)
              console.log('Map moved to user location')
              
              addMarkersToMap(vworldMap)
            }
          }, 1000)
        } else {
          throw new Error('Failed to create VWorld map')
        }

      } catch (error) {
        console.error('VWorld map initialization error:', error)
        setLoadingMessage("지도 초기화 실패: " + (error instanceof Error ? error.message : String(error)))
        setIsMapLoading(false)
      }
    }

    const addMarkersToMap = (vworldMap: any) => {
      try {
        console.log('Adding markers to map...')
        
        const vectorSource = new window.ol.source.Vector()
        const vectorLayer = new window.ol.layer.Vector({
          source: vectorSource,
          zIndex: 1000
        })
        vworldMap.addLayer(vectorLayer)

        // 사용자 위치 마커
        if (userLocation) {
          const userFeature = new window.ol.Feature({
            geometry: new window.ol.geom.Point([userLocation.lng, userLocation.lat]),
            type: 'user',
            name: '내 위치'
          })

          const userStyle = new window.ol.style.Style({
            image: new window.ol.style.Circle({
              radius: 12,
              fill: new window.ol.style.Fill({ color: '#3b82f6' }),
              stroke: new window.ol.style.Stroke({ color: 'white', width: 4 })
            })
          })
          userFeature.setStyle(userStyle)
          vectorSource.addFeature(userFeature)
        }

        // 문화재 마커들
        culturalSites.forEach((site, index) => {
          const siteFeature = new window.ol.Feature({
            geometry: new window.ol.geom.Point([site.coordinates.lng, site.coordinates.lat]),
            type: 'cultural-site',
            name: site.name,
            description: site.description,
            distance: site.distance,
            buttonText: site.buttonText,
            illustration: site.illustration,
            siteIndex: index
          })

          const siteStyle = new window.ol.style.Style({
            image: new window.ol.style.Circle({
              radius: 16,
              fill: new window.ol.style.Fill({ color: '#ef4444' }),
              stroke: new window.ol.style.Stroke({ color: 'white', width: 4 })
            })
          })
          siteFeature.setStyle(siteStyle)
          vectorSource.addFeature(siteFeature)
        })

        // 팝업 설정
        setupMapClickEvents(vworldMap)
        console.log('Markers and events added successfully')

      } catch (error) {
        console.error('Error adding markers:', error)
      }
    }

    const setupMapClickEvents = (vworldMap: any) => {
      const popupElement = document.createElement('div')
      popupElement.style.cssText = `
        position: absolute;
        background-color: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        padding: 16px;
        border-radius: 8px;
        border: 2px solid #ddd;
        min-width: 220px;
        max-width: 320px;
        font-family: system-ui, -apple-system, sans-serif;
        z-index: 2000;
      `

      const popup = new window.ol.Overlay({
        element: popupElement,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -15]
      })
      vworldMap.addOverlay(popup)

      vworldMap.on('click', function(event: any) {
        const feature = vworldMap.forEachFeatureAtPixel(event.pixel, (feature: any) => feature)

        if (feature) {
          const coordinates = feature.getGeometry().getCoordinates()
          const type = feature.get('type')
          
          if (type === 'user') {
            popupElement.innerHTML = `
              <div>
                <h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px; font-weight: bold;">
                  📍 ${feature.get('name')}
                </h3>
              </div>
            `
          } else if (type === 'cultural-site') {
            const siteIndex = feature.get('siteIndex')
            popupElement.innerHTML = `
              <div>
                <h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px; font-weight: bold;">
                  ${feature.get('illustration') || '🏛️'} ${feature.get('name')}
                </h3>
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px; line-height: 1.4;">
                  ${feature.get('description')}
                </p>
                <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                  <span style="background: #ef4444; color: white; font-size: 12px; padding: 2px 8px; border-radius: 4px;">
                    🔊 나레이션
                  </span>
                  <span style="color: #999; font-size: 14px;">${feature.get('distance')}km</span>
                </div>
                <button 
                  onclick="handleLocationClick(${siteIndex})"
                  style="
                    width: 100%; 
                    background: #a24a00; 
                    color: white; 
                    border: none; 
                    padding: 10px 16px; 
                    border-radius: 6px; 
                    cursor: pointer; 
                    font-size: 14px;
                    font-weight: 500;
                  "
                  onmouseover="this.style.background='#8a3e00'"
                  onmouseout="this.style.background='#a24a00'"
                >
                  ${feature.get('buttonText') || '자세히 보기'}
                </button>
              </div>
            `
          }
          
          popup.setPosition(coordinates)
        } else {
          popup.setPosition(undefined)
        }
      })
    }

    // 전역 함수 등록
    ;(window as any).handleLocationClick = (index: number) => {
      console.log('Location selected:', culturalSites[index].name)
      onLocationSelect(culturalSites[index])
    }

    // 즉시 스크립트 로드 시도
    console.log('Starting VWorld API load immediately...')
    const script = document.createElement('script')
    script.src = 'https://map.vworld.kr/js/vworldMapInit.js.do?version=2.0&apiKey=3EB4149F-00ED-3BB6-B068-B4D71687BDF6'
    script.async = true
    console.log('Immediate script src:', script.src)
    document.head.appendChild(script)
    
    // 지도 초기화 시작
    console.log('Starting VWorld map initialization...')
    initializeVWorldMap().catch(error => {
      console.error('Failed to initialize VWorld map:', error)
      setLoadingMessage("지도 초기화 실패")
      setIsMapLoading(false)
    })

    return () => {
      delete (window as any).handleLocationClick
      if (mapRef.current) {
        mapRef.current.innerHTML = ''
      }
    }
  }, [userLocation, culturalSites, onLocationSelect])

  const moveToUserLocation = () => {
    if (map && userLocation) {
      try {
        // 사용자 위치로 지도 이동
        if (map.getView) {
          const center = [userLocation.lng, userLocation.lat]
          map.getView().setCenter(center)
          map.getView().setZoom(15)
          console.log('Map moved to user location')
        }
      } catch (error) {
        console.error('Error moving to user location:', error)
      }
    }
  }

  if (isMapLoading || !userLocation) {
    return (
      <div className="flex flex-col min-h-screen bg-background korean-pattern pb-16">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{loadingMessage}</p>
            <p className="text-xs text-muted-foreground">
              브라우저 콘솔에서 로딩 상태를 확인하세요
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background korean-pattern pb-16">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card dancheong-accent">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 bg-primary shadow-lg">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">지</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-xl text-primary">문화유산 지도</h1>
            <p className="text-sm text-muted-foreground">VWorld 국토교통부 지도로 문화유산을 탐험하세요</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLanguageChange(userProfile.language === "ko" ? "en" : "ko")}
            className="border-primary/20"
          >
            <Globe className="w-4 h-4" />
            {userProfile.language === "ko" ? "EN" : "한"}
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div 
          ref={mapRef}
          id="vworldMap"
          style={{ 
            width: '100%', 
            height: '100%',
            minHeight: '400px',
            backgroundColor: '#f0f0f0'
          }} 
        />

        {/* Map Controls */}
        <div className="absolute bottom-20 right-6 flex flex-col gap-3 z-10">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 w-12 h-12"
            onClick={moveToUserLocation}
            title="내 위치로 이동"
            disabled={!userLocation || !map}
          >
            <Crosshair className="w-5 h-5 text-gray-700" />
          </Button>
        </div>
      </div>
    </div>
  )
}