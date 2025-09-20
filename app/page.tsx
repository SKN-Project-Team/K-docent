"use client"

import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, ChevronDown, X, Calendar, MapPin, Phone, Bot } from "lucide-react"
import { useState, useEffect } from "react"
import { AppHeader } from "@/components/Layout/AppHeader"
import { BottomNavigation } from "@/components/Layout/BottomNavigation"
import { LanguageModal } from "@/components/Layout/LanguageModal"
import { NarrationButton } from "@/components/NarrationButton"
import { NarrationRequestModal } from "@/components/NarrationRequestModal"
import { useNearbyHeritage, useGeolocation } from "@/lib/api/hooks"
import { getInitialLanguage, setStoredLanguage, validateLanguageCode } from "@/utils/languageUtils"
import { useTranslation } from "@/utils/i18n"

// Festival 타입 정의
type Festival = {
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
}

export default function Home() {
  const router = useRouter()
  const { userProfile, setUserProfile } = useApp()
  const { t } = useTranslation(userProfile.language)
  const [searchQuery, setSearchQuery] = useState("")

  // 나레이션 모드 상태 추가
  const [narrationMode, setNarrationMode] = useState("children")

  // 나레이션 관련 상태
  const [playingNarration, setPlayingNarration] = useState<number | null>(null)
  const [narrationRequestModal, setNarrationRequestModal] = useState<{
    isOpen: boolean
    heritageId: number
    heritageName: string
  }>({
    isOpen: false,
    heritageId: 0,
    heritageName: ''
  })
  
  // 축제 카드 확장 상태 추가
  const [expandedFestival, setExpandedFestival] = useState<string | null>(null)
  
  // 축제 데이터 상태 관리
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 위치 및 문화재 데이터 관리
  const { location, loading: locationLoading, error: locationError } = useGeolocation()
  const { heritage, loading: heritageLoading, error: heritageError, refetch } = useNearbyHeritage(
    location ? {
      latitude: location.lat,
      longitude: location.lng,
      radius_km: 10.0,
      language: userProfile.language || 'ko', // 필수 파라미터
      limit: 30
    } : undefined
  )

  // 축제 데이터를 API에서 가져오는 함수
  const fetchFestivals = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // 기본 위치 (서울시청 좌표)
      const defaultLat = 37.5666805
      const defaultLng = 126.9784147
      
      const response = await fetch(`/api/festivals?lat=${defaultLat}&lng=${defaultLng}&maxResults=10&language=${userProfile.language}`)
      
      if (!response.ok) {
        throw new Error('축제 데이터를 가져오는데 실패했습니다.')
      }
      
      const data = await response.json()
      // API 응답에서 festivals 배열을 추출
      setFestivals(data.festivals || [])
      
    } catch (err) {
      console.error('축제 데이터 로딩 오류:', err)
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      
      // 오류 발생 시 기본 데이터 사용
      setFestivals([
        {
          id: "default-1",
          title: "국가유산 교육 프로그램",
          description: "국가유산을 새롭게 경험해보세요",
          startDate: "20241201",
          endDate: "20241231",
          address: "서울특별시",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop&crop=center",
          category: "교육/체험",
          isOngoing: true
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // 컴포넌트 마운트 시 축제 데이터 로드, 언어 변경 시에도 다시 로드
  useEffect(() => {
    fetchFestivals()
  }, [userProfile.language])

  // API 데이터를 기존 형식에 맞게 변환하는 함수
  const formatFestivalForDisplay = (festival: Festival) => {
    const formatDate = (dateStr: string) => {
      if (!dateStr || dateStr.length !== 8) return dateStr
      const year = dateStr.substring(0, 4)
      const month = dateStr.substring(4, 6)
      const day = dateStr.substring(6, 8)
      return `${year}.${month}.${day}`
    }

    return {
      title: festival.title,
      date: `${formatDate(festival.startDate)} ~ ${formatDate(festival.endDate)}`,
      place: festival.address,
      img: festival.image || festival.thumbnailImage || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop&crop=center",
      icon: festival.isOngoing ? "🎉" : "📅",
      location: festival.address.split(' ')[0] || "전국",
      description: festival.description || festival.category,
      badgeColor: festival.isOngoing ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800",
      bgColor: festival.isOngoing ? "from-green-500 to-emerald-600" : "from-blue-500 to-indigo-600"
    }
  }

  // 문화재 카드 클릭 핸들러
  const handleHeritageNavigate = (heritage: any) => {
    router.push(`/detail/${heritage.content_id}`)
  }

  // AI 해설사 버튼 핸들러
  const handleAIGuide = (heritage: any) => {
    // AI 해설사 기능 - 상세 페이지로 이동하여 AI 해설 시작
    router.push(`/detail/${heritage.content_id}?mode=ai-guide`)
  }


  // 나레이션 재생/일시정지 핸들러
  const handleNarrationToggle = (heritageId: number) => {
    if (playingNarration === heritageId) {
      setPlayingNarration(null) // 일시정지
    } else {
      setPlayingNarration(heritageId) // 재생
    }
  }

  // 나레이션 생성 요청 핸들러
  const handleNarrationRequest = (heritageId: number, heritageName: string) => {
    setNarrationRequestModal({
      isOpen: true,
      heritageId,
      heritageName
    })
  }

  // 나레이션 생성 확인 핸들러
  const handleNarrationGeneration = async () => {
    // TODO: 실제 나레이션 생성 API 호출
    console.log('나레이션 생성 요청:', {
      heritageId: narrationRequestModal.heritageId,
      heritageName: narrationRequestModal.heritageName,
      mode: narrationMode,
      language: userProfile.language
    })

    // 임시로 2초 후 완료 처리
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  const handleLanguageChange = (lang: string) => {
    const validatedLang = validateLanguageCode(lang)
    setStoredLanguage(validatedLang) // 세션 스토리지에 저장
    setUserProfile((prev) => ({ ...prev, language: validatedLang }))
  }

  // 세션 스토리지에서 언어 설정 복원 및 초기 설정
  useEffect(() => {
    const initialLanguage = getInitialLanguage()
    if (userProfile.language !== initialLanguage) {
      setUserProfile((prev) => ({ ...prev, language: initialLanguage }))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  // 나레이션 모드 옵션
  const narrationModes = [
    {
      key: "adult",
      label: t('narration.adultMode'),
      description: t('narration.adultDescription')
    },
    {
      key: "children",
      label: t('narration.childrenMode'),
      description: t('narration.childrenDescription')
    }
  ]


  // 추천 문화재 필터링 - 검색어 적용
  const filteredHeritage = heritage?.results ? heritage.results.filter(site => {
    const matchesSearch = searchQuery === "" || // 검색어가 없으면 모든 항목 표시
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.description_summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.content_id.toString().includes(searchQuery.toLowerCase())

    return matchesSearch
  }) : []

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <AppHeader
        actions={[{
          key: "language",
          component: (
            <LanguageModal
              currentLanguage={userProfile.language}
              onLanguageChange={handleLanguageChange}
            />
          ),
        }]}
      />
      

      {/* 검색바 */}
      <div className="px-4 py-2">
        <div className="relative">
          <Input
            type="text"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 pr-10 py-3 bg-gray-100 border-none rounded-xl text-sm"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>


      {/* 나레이션 모드 선택 섹션 */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2">
          <p className="font-medium text-lg">
            {t('narration.selectType')}{" "}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium underline decoration-dotted underline-offset-4">
                <span>{narrationModes.find(mode => mode.key === narrationMode)?.label}</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {narrationModes.map((mode) => (
                  <DropdownMenuItem
                    key={mode.key}
                    onSelect={() => setNarrationMode(mode.key)}
                    className={`cursor-pointer flex flex-col items-start p-3 ${
                      mode.key === narrationMode ? "bg-primary/10 text-primary" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span className="font-medium">{mode.label}</span>
                      {mode.key === narrationMode && (
                        <span className="ml-auto text-primary text-xs">✓</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{mode.description}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </p>
        </div>
      </div>

      {/* 추천 문화재 피드 */}
      <div className="py-4">
        <div className="px-4 mb-4">
          <h3 className="font-bold text-lg text-gray-800">{t('heritage.recommended')}</h3>
          <p className="text-sm text-gray-600">
            {location && !locationError
              ? t('heritage.currentLocationDescription', {
                  radius: String(heritage?.search_radius_km || 10),
                  mode: narrationModes.find(mode => mode.key === narrationMode)?.label || ''
                })
              : t('heritage.locationPermissionDescription')
            }
          </p>
        </div>

        {/* 위치 로딩 중 */}
        {locationLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm text-gray-600">{t('heritage.locationLoading')}</p>
          </div>
        )}

        {/* 위치 오류 */}
        {locationError && (
          <div className="px-4">
            <Card className="p-6 text-center border-red-200 bg-red-50">
              <p className="text-red-600 text-sm mb-3">{locationError}</p>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                {t('common.retry')}
              </Button>
            </Card>
          </div>
        )}

        {/* 문화재 로딩 중 */}
        {location && heritageLoading && (
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 px-4 pb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-72 h-110 bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        )}

        {/* 문화재 오류 */}
        {heritageError && (
          <div className="px-4">
            <Card className="p-6 text-center border-red-200 bg-red-50">
              <p className="text-red-600 text-sm mb-3">
                {t('heritage.errorLoading')}
              </p>
              <p className="text-gray-600 text-xs mb-3">{heritageError.getUserFriendlyMessage()}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (location) {
                    refetch({
                      latitude: location.lat,
                      longitude: location.lng,
                      radius_km: 10.0,
                      language: userProfile.language || 'ko',
                      limit: 50
                    })
                  }
                }}
              >
                {t('common.retry')}
              </Button>
            </Card>
          </div>
        )}

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-4 pb-2">
            {filteredHeritage.length === 0 && searchQuery && heritage?.results ? (
              <div className="flex-shrink-0 w-72 p-6 bg-white rounded-xl border text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">{t('heritage.noResults')}</h4>
                <p className="text-sm text-gray-600">{t('heritage.tryDifferentKeyword')}</p>
              </div>
            ) : filteredHeritage.length === 0 && heritage?.results && heritage.results.length === 0 ? (
              <div className="flex-shrink-0 w-72 p-8 bg-white rounded-xl border text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏛️</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">{t('heritage.nearbyNotFound')}</h4>
                <p className="text-sm text-gray-600">{t('heritage.exploreOtherAreas')}</p>
              </div>
            ) : (
              filteredHeritage.map((heritage_item) => (
                <Card
                  key={heritage_item.content_id}
                  className="flex-shrink-0 w-72 h-110 relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/30 rounded-xl"
                  onClick={() => handleHeritageNavigate(heritage_item)}
                  style={{
                    backgroundImage: heritage_item.image_url ? `url(${heritage_item.image_url})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* 배경 이미지 오버레이 */}
                  <div className={`absolute inset-0 ${
                    heritage_item.image_url
                      ? 'bg-gradient-to-t from-black/70 via-black/20 to-black/30'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600'
                  } transition-all duration-300 group-hover:from-black/80`}></div>

                  <div className="relative p-6 h-full text-white z-10 flex flex-col">
                    {/* Top Section with Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800 shadow-sm backdrop-blur-sm text-xs">
                        Heritage
                      </Badge>
                      {heritage_item.has_tts_audio && (
                        <Badge variant="secondary" className="bg-blue-500/90 text-white shadow-sm backdrop-blur-sm text-xs">
                          {t('heritage.audioGuide')}
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="mb-4">
                        <h3 className="font-bold text-xl mb-2 drop-shadow-lg filter">
                          {heritage_item.name}
                        </h3>
                        <p className="text-sm leading-relaxed mb-3 line-clamp-2 text-white/90 drop-shadow-sm">
                          {heritage_item.description_summary}
                        </p>

                        <div className="flex items-center gap-3 text-xs mb-4">
                          <div className="flex items-center gap-1 text-white/80">
                            <MapPin className="w-3 h-3" />
                            <span className="font-medium">
                              {heritage_item.distance_km < 1
                                ? `${Math.round(heritage_item.distance_km * 1000)}m`
                                : `${heritage_item.distance_km.toFixed(1)}km`
                              }
                            </span>
                          </div>
                          <Badge variant="outline" className="border-white/50 text-white/90 bg-white/10 backdrop-blur-sm text-xs">
                            {heritage_item.language.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <NarrationButton
                          hasAudio={heritage_item.has_tts_audio}
                          isPlaying={playingNarration === heritage_item.content_id}
                          onPlayToggle={() => handleNarrationToggle(heritage_item.content_id)}
                          onRequestGeneration={() => handleNarrationRequest(heritage_item.content_id, heritage_item.name)}
                          className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 hover:border-white/50 py-3"
                          language={userProfile.language}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                </Card>
              ))
            )}

            {/* 더보기 카드 */}
            {heritage && heritage.results && heritage.results.length > 0 && (
              <div className="flex-shrink-0 w-72 h-110 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary/50 hover:bg-gray-100 transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">{t('heritage.more')}</h4>
                  <p className="text-sm text-gray-600">{t('heritage.viewAll')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>





      {/* 근처 공공기관 행사 정보 */}
      <div className="flex-1 px-4 py-8 mt-6" style={{background: 'linear-gradient(135deg, #E1DCCA40 0%, #E1DCCA20 100%)'}}>
        <div className="mb-4">
          <h3 className="font-bold text-lg text-gray-800 mb-1">{t('events.title')}</h3>
          <p className="text-sm text-gray-600">{t('events.description')}</p>
        </div>

        {/* 축제 리스트 - 세로 스크롤 */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden relative animate-pulse">
                <div className="h-32 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="overflow-hidden text-white relative cursor-pointer transition-all duration-500 bg-red-500">
            <div className="p-6">
              <div className="text-center">
                <h4 className="font-bold text-xl mb-2">{t('events.dataError')}</h4>
                <p className="text-white/90 text-sm mb-2">{error}</p>
                <Button
                  onClick={fetchFestivals}
                  variant="outline"
                  className="text-red-500 border-white hover:bg-white/10"
                >
                  {t('common.retry')}
                </Button>
              </div>
            </div>
          </Card>
        ) : festivals.length > 0 ? (
          <div className="space-y-4 h-full overflow-y-auto">
            {festivals.map((festival) => (
              <Card 
                key={festival.id}
                className={`overflow-hidden text-white relative cursor-pointer transition-all duration-500 ${
                  expandedFestival === festival.id ? 'shadow-2xl' : 'hover:shadow-lg'
                }`}
                onClick={() => setExpandedFestival(festival.id === expandedFestival ? null : festival.id)}
                style={{
                  backgroundImage: formatFestivalForDisplay(festival).img ? `url(${formatFestivalForDisplay(festival).img})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  minHeight: expandedFestival === festival.id ? '300px' : '120px'
                }}
              >
                {/* 배경 이미지를 어둡게 처리하는 강한 오버레이 */}
                <div className={`absolute inset-0 ${
                  formatFestivalForDisplay(festival).img 
                    ? 'bg-black/70' 
                    : formatFestivalForDisplay(festival).bgColor
                } transition-all duration-300`}></div>
                
                <div className="relative p-4 h-full text-white z-10 flex flex-col">
                  {/* 닫기 버튼 (확장된 상태에서만 표시) */}
                  {expandedFestival === festival.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 p-2 h-auto hover:bg-white/20 rounded-full transition-colors z-20"
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedFestival(null)
                      }}
                    >
                      <X className="w-4 h-4 text-white" />
                    </Button>
                  )}

                  {/* 기본 카드 내용 */}
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800 shadow-sm backdrop-blur-sm text-xs">
                      {t('events.ongoing')}
                    </Badge>
                  </div>

                  <div className="flex-1 flex flex-col justify-end">
                    <h4 className="font-bold text-lg mb-1">
                      {formatFestivalForDisplay(festival).title}
                    </h4>
                    <p className="text-sm text-white/90 mb-2 line-clamp-2">
                      {formatFestivalForDisplay(festival).description}
                    </p>

                    {/* 확장된 상태에서 추가 정보 표시 */}
                    {expandedFestival === festival.id && (
                      <div className="mt-4 space-y-3 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{formatFestivalForDisplay(festival).date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{formatFestivalForDisplay(festival).place}</span>
                          </div>
                          {festival.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4" />
                              <span>{festival.phone}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-2 rounded-lg shadow-lg transition-all duration-200 backdrop-blur-sm border border-white/30 hover:border-white/50 text-sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              // 상세 페이지로 이동 또는 추가 액션
                            }}
                          >
                            {t('common.details')}
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 bg-transparent hover:bg-white/10 text-white font-medium py-2 rounded-lg shadow-lg transition-all duration-200 backdrop-blur-sm border border-white/50 hover:border-white/70 text-sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              // 지도에서 보기 또는 위치 정보
                            }}
                          >
                            {t('events.viewLocation')}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* 기본 상태에서의 간단한 정보 */}
                    {expandedFestival !== festival.id && (
                      <div className="flex items-center justify-between text-xs text-white/80 mt-1">
                        <span>{formatFestivalForDisplay(festival).date}</span>
                        <span className="truncate ml-2">{formatFestivalForDisplay(festival).place}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Card className="overflow-hidden text-white relative bg-gradient-to-br from-gray-400 to-gray-500">
              <div className="p-6 text-center">
                <h4 className="font-bold text-xl mb-2">{t('events.noEvents')}</h4>
                <p className="text-white/90 text-sm">{t('events.noCurrentEvents')}</p>
              </div>
            </Card>
          </div>
        )}

        {/* ... existing code ... */}
      </div>

      {/* 나레이션 생성 요청 모달 */}
      <NarrationRequestModal
        isOpen={narrationRequestModal.isOpen}
        onOpenChange={(open) => setNarrationRequestModal(prev => ({ ...prev, isOpen: open }))}
        heritageName={narrationRequestModal.heritageName}
        narrationMode={narrationMode as 'children' | 'adult'}
        onConfirm={handleNarrationGeneration}
        language={userProfile.language}
      />

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  )
}
