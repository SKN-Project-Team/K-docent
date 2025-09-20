"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Globe, Navigation, Star, RotateCcw, Map, MapPin, Volume2, Calendar, Phone } from "lucide-react"
import { LocationData, FestivalData, FestivalApiResponse, MultilingualText } from "@/types"
import { getTranslatedText, uiTexts } from "@/utils/translation"

const defaultButtonText: MultilingualText = {
  ko: "지금 둘러볼게요",
  ja: "今見学します",
  en: "Explore Now",
  zh: "现在参观",
  es: "Explorar Ahora",
  fr: "Explorer Maintenant",
}

interface LocationScreenProps {
  culturalSites: LocationData[]
  userProfile: {
    language: string
    level: string
    interests: string[]
  }
  onLocationSelect: (location: LocationData) => void
  onLanguageChange: (lang: string) => void
  onViewChange: (view: "location" | "map") => void
}

export default function LocationScreen({
  culturalSites,
  userProfile,
  onLocationSelect,
  onLanguageChange,
  onViewChange
}: LocationScreenProps) {
  const [festivals, setFestivals] = useState<FestivalData[]>([])
  const [festivalLoading, setFestivalLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"sites" | "festivals">("sites")
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)

  const aiNarrationLabel = getTranslatedText(uiTexts.aiNarration, userProfile.language)
  const listLabel = getTranslatedText(uiTexts.list, userProfile.language)
  const mapLabel = getTranslatedText(uiTexts.map, userProfile.language)
  const avatarLetter = getTranslatedText(uiTexts.avatarLetter, userProfile.language)

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.warn('위치 정보를 가져올 수 없습니다:', error)
          // 기본 위치 (서울 중심부)
          setUserLocation({ lat: 37.5665, lng: 126.9780 })
        }
      )
    } else {
      setUserLocation({ lat: 37.5665, lng: 126.9780 })
    }
  }, [])

  // 축제 정보 불러오기
  const fetchFestivals = async () => {
    if (!userLocation) return
    
    setFestivalLoading(true)
    try {
      const params = new URLSearchParams({
        lat: userLocation.lat.toString(),
        lng: userLocation.lng.toString(),
        radius: '20000', // 20km 반경
        maxResults: '15'
      })
      
      const response = await fetch(`/api/festivals?${params}`)
      if (response.ok) {
        const data: FestivalApiResponse = await response.json()
        setFestivals(data.festivals)
      } else {
        console.error('축제 정보를 가져오는데 실패했습니다:', response.status)
      }
    } catch (error) {
      console.error('축제 API 호출 오류:', error)
    } finally {
      setFestivalLoading(false)
    }
  }

  useEffect(() => {
    if (userLocation) {
      fetchFestivals()
    }
  }, [userLocation])

  // 축제 날짜 포맷팅
  const formatFestivalDate = (startDate: string, endDate: string) => {
    const formatDate = (dateStr: string) => {
      if (dateStr.length !== 8) return dateStr
      const year = dateStr.substring(0, 4)
      const month = dateStr.substring(4, 6)
      const day = dateStr.substring(6, 8)
      return `${year}.${month}.${day}`
    }
    
    const start = formatDate(startDate)
    const end = formatDate(endDate)
    return startDate === endDate ? start : `${start} ~ ${end}`
  }

  // 축제 상태 텍스트
  const getFestivalStatusText = (festival: FestivalData) => {
    if (festival.isOngoing) {
      return festival.daysUntilEnd 
        ? `진행 중 (${festival.daysUntilEnd}일 남음)`
        : "진행 중"
    }
    if (festival.daysUntilStart) {
      return `${festival.daysUntilStart}일 후 시작`
    }
    return "곧 시작"
  }

  // 축제 상태 색상
  const getFestivalStatusColor = (festival: FestivalData) => {
    if (festival.isOngoing) return "bg-green-500"
    if (festival.daysUntilStart && festival.daysUntilStart <= 7) return "bg-orange-500"
    return "bg-blue-500"
  }

  return (
    <div className="flex flex-col h-screen bg-background korean-pattern">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card dancheong-accent">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 bg-primary shadow-lg">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
              {avatarLetter}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-xl text-primary">한국문화 AI 나레이터</h1>
            <p className="text-sm text-muted-foreground">전통과 현대가 만나는 문화 여행</p>
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

      {/* Tab Navigation */}
      <div className="flex border-b bg-white">
        <button
          onClick={() => setActiveTab("sites")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${
            activeTab === "sites"
              ? "border-b-2 border-primary text-primary bg-primary/5"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          <Navigation className="w-4 h-4" />
          문화유적지 ({culturalSites.length})
        </button>
        <button
          onClick={() => setActiveTab("festivals")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${
            activeTab === "festivals"
              ? "border-b-2 border-primary text-primary bg-primary/5"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          <Calendar className="w-4 h-4" />
          행사/축제 ({festivals.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "sites" && (
          <>
            <div className="p-4 pb-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-primary">주변 문화유적지</h2>
                    <p className="text-sm text-muted-foreground">위아래로 스크롤하여 원하는 장소를 선택해보세요</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-primary/10 text-primary"
                  onClick={() => {
                    console.log('Refreshing cultural sites...')
                  }}
                  title="주변 문화유적지 새로고침"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="overflow-y-auto px-4 pb-28 h-full">
              <div className="space-y-4">
                {culturalSites.map((site, idx) => (
                  <Card
                    key={idx}
                    className={`relative overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/30 w-full group`}
                    onClick={() => onLocationSelect(site)}
                    style={{
                      backgroundImage: site.backgroundImage ? `url(${site.backgroundImage})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      minHeight: '200px'
                    }}
                  >
                    {/* 배경 이미지 오버레이 */}
                    <div className={`absolute inset-0 ${site.backgroundImage ? 'bg-black/40' : site.color || 'bg-gradient-to-br from-gray-100 to-gray-200'} transition-all duration-300 group-hover:bg-black/50`}></div>
                    
                    <div className="relative p-6 h-full text-white z-10">
                      {/* Top Section with Icon and Badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-5xl mb-2 drop-shadow-2xl filter">{site.illustration ?? "🏛️"}</div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="secondary" className="bg-white/90 text-gray-800 shadow-lg backdrop-blur-sm">
                            <Volume2 className="w-3 h-3 mr-1" />
                            {aiNarrationLabel}
                          </Badge>
                          <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1 backdrop-blur-sm">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs font-medium text-gray-800">4.8</span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mb-6">
                        <h3 className="font-bold text-2xl mb-3 drop-shadow-lg filter">
                          {getTranslatedText(site.name, userProfile.language)}
                        </h3>
                        <p className="text-sm leading-relaxed mb-4 line-clamp-3 text-white/90 drop-shadow-sm">
                          {getTranslatedText(site.description, userProfile.language)}
                        </p>

                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1 text-white/80">
                            <MapPin className="w-3 h-3" />
                            {typeof site.distance === "number" && (
                              <span className="font-medium">{site.distance}km</span>
                            )}
                          </div>
                          <Badge variant="outline" className="border-white/50 text-white/90 bg-white/10 backdrop-blur-sm">
                            {getTranslatedText(site.category, userProfile.language)}
                          </Badge>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-auto">
                        <Button
                          className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-4 rounded-xl shadow-lg transition-all duration-200 text-base backdrop-blur-sm border border-white/30 hover:border-white/50"
                          onClick={(e) => {
                            e.stopPropagation()
                            onLocationSelect(site)
                          }}
                        >
                          {site.buttonText
                            ? getTranslatedText(site.buttonText, userProfile.language)
                            : getTranslatedText(defaultButtonText, userProfile.language)}
                        </Button>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-10"></div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "festivals" && (
          <>
            <div className="p-4 pb-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-primary">주변 행사/축제</h2>
                    <p className="text-sm text-muted-foreground">진행 중이거나 예정된 문화 행사를 확인해보세요</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-primary/10 text-primary"
                  onClick={fetchFestivals}
                  disabled={festivalLoading}
                  title="행사/축제 정보 새로고침"
                >
                  <RotateCcw className={`w-5 h-5 ${festivalLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            <div className="overflow-y-auto px-4 pb-28 h-full">
              {festivalLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">행사 정보를 불러오는 중...</p>
                  </div>
                </div>
              ) : festivals.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">주변에 진행 중인 행사가 없습니다</p>
                    <p className="text-sm text-gray-400 mt-1">다른 지역을 탐색해보세요</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {festivals.map((festival) => (
                    <Card
                      key={festival.id}
                      className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/30"
                      onClick={() => {
                        // 축제 상세 정보 보기 (추후 구현)
                        console.log('축제 선택:', festival)
                      }}
                    >
                      <div className="p-5">
                        <div className="flex gap-4">
                          {/* 이미지 */}
                          <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            {festival.image || festival.thumbnailImage ? (
                              <img
                                src={festival.image || festival.thumbnailImage}
                                alt={festival.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none'
                                  const parent = (e.target as HTMLElement).parentElement
                                  if (parent) {
                                    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl">🎪</div>'
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">🎪</div>
                            )}
                          </div>

                          {/* 콘텐츠 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{festival.title}</h3>
                              <div className={`px-2 py-1 rounded-full text-xs text-white font-medium ${getFestivalStatusColor(festival)}`}>
                                {festival.isOngoing && (
                                  <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                    진행중
                                  </div>
                                )}
                                {!festival.isOngoing && festival.daysUntilStart && (
                                  <span>D-{festival.daysUntilStart}</span>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{formatFestivalDate(festival.startDate, festival.endDate)}</span>
                              </div>

                              {festival.address && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span className="line-clamp-1">{festival.address}</span>
                                </div>
                              )}

                              {festival.distance && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Navigation className="w-4 h-4" />
                                  <span>{(festival.distance / 1000).toFixed(1)}km</span>
                                </div>
                              )}

                              {festival.phone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone className="w-4 h-4" />
                                  <span>{festival.phone}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-3">
                              <Badge variant="secondary" className="text-xs">
                                {festival.category}
                              </Badge>
                              <div className="text-xs text-gray-500">
                                {getFestivalStatusText(festival)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Mobile Navigation Bar */}
      <div className="flex border-t bg-card/90 backdrop-blur-sm">
        <Button
          variant="default"
          className="flex-1 flex flex-col items-center gap-1 py-3 h-auto rounded-none bg-primary text-primary-foreground"
        >
          <Navigation className="w-5 h-5" />
          <span className="text-xs">{listLabel}</span>
        </Button>
        <Button
          variant="ghost"
          className="flex-1 flex flex-col items-center gap-1 py-3 h-auto rounded-none border-l text-muted-foreground"
          onClick={() => onViewChange("map")}
        >
          <Map className="w-5 h-5" />
          <span className="text-xs">{mapLabel}</span>
        </Button>
      </div>
    </div>
  )
}
