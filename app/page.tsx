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
import { Search, Map, ChevronDown, ArrowRight, X, Calendar, MapPin, Phone } from "lucide-react"
import { useState, useEffect } from "react"
import { getTranslatedText, uiTexts } from "@/utils/translation"
import { AppHeader } from "@/components/Layout/AppHeader"

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
  const { culturalSites, userProfile, setUserProfile } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  
  // 필터 상태 추가
  const [companionFilter, setCompanionFilter] = useState("아이와 함께")
  const [locationFilter, setLocationFilter] = useState("경복궁") // 기본값을 "전체"로 변경
  
  // 축제 선택 상태
  const [selectedFestival, setSelectedFestival] = useState(0)
  
  // 축제 카드 확장 상태 추가
  const [expandedFestival, setExpandedFestival] = useState<string | null>(null)
  
  // 축제 데이터 상태 관리
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 축제 데이터를 API에서 가져오는 함수
  const fetchFestivals = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // 기본 위치 (서울시청 좌표)
      const defaultLat = 37.5666805
      const defaultLng = 126.9784147
      
      const response = await fetch(`/api/festivals?lat=${defaultLat}&lng=${defaultLng}&maxResults=10`)
      
      if (!response.ok) {
        throw new Error('축제 데이터를 가져오는데 실패했습니다.')
      }
      
      const data = await response.json()
      // API 응답에서 festivals 배열을 추출
      setFestivals(data.festivals || [])
      
      // 축제가 있으면 첫 번째 축제를 선택
      if (data.festivals && data.festivals.length > 0) {
        setSelectedFestival(0)
      }
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

  // 컴포넌트 마운트 시 축제 데이터 로드
  useEffect(() => {
    fetchFestivals()
  }, [])

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

  const handleLocationSelect = (siteId: string) => {
    router.push(`/detail/${siteId}`)
  }

  const handleLanguageChange = (lang: string) => {
    setUserProfile((prev) => ({ ...prev, language: lang }))
  }

  // 언어 목록과 국기
  const languages = [
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ]

  // 현재 선택된 언어 정보
  const currentLanguage = languages.find(lang => lang.code === userProfile.language) || languages[0]

  // 동행자 필터 옵션
  const companionOptions = [
    "아이들과",
    "연인과 함께",
    "혼자",
    "친구들과",
    "가족과"
  ]

  // 장소 필터 옵션 (카드에 표시되는 장소들 기반)
  const locationOptions = culturalSites.map(site => 
    getTranslatedText(site.name, userProfile.language)
  ) // slice 제거하여 모든 장소 표시

  // 추천관광지 카드용 - 검색어만 적용
  const filteredSites = culturalSites.filter(site => {
    const matchesSearch = searchQuery === "" || // 검색어가 없으면 모든 항목 표시
      getTranslatedText(site.name, userProfile.language).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getTranslatedText(site.description, userProfile.language).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getTranslatedText(site.category, userProfile.language).toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch // locationFilter는 추천관광지 카드에서 제외
  })

  return (
    <div className="flex flex-col min-h-screen bg-background pb-16">
      <AppHeader
        actions={[{
          key: "map",
          icon: <Map className="w-4 h-4" />,
          label: "지도",
          onClick: () => router.push("/map"),
          variant: "outline",
          className: "border-gray-200 text-gray-700 hover:bg-gray-100",
        }]}
      />
      

      {/* 검색바 */}
      <div className="px-4 py-2">
        <div className="relative">
          <Input
            type="text"
            placeholder="어디로 가보시겠어요?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 pr-10 py-3 bg-gray-100 border-none rounded-xl text-sm"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>


      {/* 가로형 피드 */}
      <div className="py-4">
        <div className="px-4 mb-4">
          <h3 className="font-bold text-lg text-gray-800">추천 관광지</h3>
          <p className="text-sm text-gray-600">한국의 아름다운 장소를 경험해보세요.</p>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-4 pb-2">
            {filteredSites.length === 0 && searchQuery ? (
              <div className="flex-shrink-0 w-72 p-6 bg-white rounded-xl border text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">검색 결과 없음</h4>
                <p className="text-sm text-gray-600">다른 키워드로 검색해보세요</p>
              </div>
            ) : (
              filteredSites.map((site, idx) => (
                <Card
                  key={idx}
                  className="flex-shrink-0 w-72 h-110 relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/30 rounded-xl"
                  onClick={() => handleLocationSelect(getTranslatedText(site.name, userProfile.language))}
                  style={{
                    backgroundImage: site.backgroundImage ? `url(${site.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* 배경 이미지 오버레이 */}
                  <div className={`absolute inset-0 ${
                    site.backgroundImage 
                      ? 'bg-gradient-to-t from-black/70 via-black/20 to-black/30' 
                      : site.color || 'bg-gradient-to-br from-gray-100 to-gray-200'
                  } transition-all duration-300 group-hover:from-black/80`}></div>
                  
                  <div className="relative p-6 h-full text-white z-10 flex flex-col">
                    {/* Top Section with Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800 shadow-sm backdrop-blur-sm text-xs">
                        {getTranslatedText(uiTexts.aiNarration, userProfile.language)}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="mb-4">
                        <h3 className="font-bold text-xl mb-2 drop-shadow-lg filter">
                          {getTranslatedText(site.name, userProfile.language)}
                        </h3>
                        <p className="text-sm leading-relaxed mb-3 line-clamp-2 text-white/90 drop-shadow-sm">
                          {getTranslatedText(site.description, userProfile.language)}
                        </p>

                        <div className="flex items-center gap-3 text-xs mb-4">
                          <div className="flex items-center gap-1 text-white/80">
                            <span className="font-medium">{site.distance}km</span>
                          </div>
                          <Badge variant="outline" className="border-white/50 text-white/90 bg-white/10 backdrop-blur-sm text-xs">
                            {getTranslatedText(site.category, userProfile.language)}
                          </Badge>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 rounded-lg shadow-lg transition-all duration-200 text-sm backdrop-blur-sm border border-white/30 hover:border-white/50"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLocationSelect(getTranslatedText(site.name, userProfile.language))
                        }}
                      >
                        {getTranslatedText(site.buttonText!, userProfile.language)}
                      </Button>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                </Card>
              ))
            )}
            
            {/* 더보기 카드 */}
            {culturalSites.length > 0 && (
              <div className="flex-shrink-0 w-72 h-110 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary/50 hover:bg-gray-100 transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">➕</span>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">더 많은 명소</h4>
                  <p className="text-sm text-gray-600">전체 목록 보기</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* 질문 섹션 */}
      <div className="px-4 py-4">
        <p className="text-gray-600 text-sm mb-2">요즘 핫한 그 곳! 자세히 알아볼래?</p>
        <div className="flex items-center gap-2">
          <p className="font-medium text-lg">
            오늘은{" "}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium underline decoration-dotted underline-offset-4">
                <span>{companionFilter}</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                {companionOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onSelect={() => setCompanionFilter(option)}
                    className={`cursor-pointer ${
                      option === companionFilter ? "bg-primary/10 text-primary" : ""
                    }`}
                  >
                    {option}
                    {option === companionFilter && (
                      <span className="ml-auto text-primary text-xs">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {" , "}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium underline decoration-dotted underline-offset-4">
                <span>{locationFilter}</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 max-h-60 overflow-y-auto">
                <DropdownMenuItem
                  onSelect={() => setLocationFilter("전체")}
                  className={`cursor-pointer ${
                    "전체" === locationFilter ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  전체
                  {"전체" === locationFilter && (
                    <span className="ml-auto text-primary text-xs">✓</span>
                  )}
                </DropdownMenuItem>
                {locationOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onSelect={() => setLocationFilter(option)}
                    className={`cursor-pointer ${
                      option === locationFilter ? "bg-primary/10 text-primary" : ""
                    }`}
                  >
                    {option}
                    {option === locationFilter && (
                      <span className="ml-auto text-primary text-xs">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            로 가볼까?
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-auto hover:bg-primary/10 rounded-full transition-colors"
            onClick={() => {
              // 첫 번째 필터링된 사이트로 이동
              if (filteredSites.length > 0) {
                const firstSite = filteredSites[0]
                handleLocationSelect(getTranslatedText(firstSite.name, userProfile.language))
              }
            }}
          >
            <ArrowRight className="w-5 h-5 text-primary" />
          </Button>
        </div>
      </div>


      {/* 언어 선택 (숨김 처리, 필요시 접근) */}
      <div className="hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md border border-primary/20 bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 touch-manipulation">
            <span className="text-base">{currentLanguage.flag}</span>
            <span className="text-sm">{currentLanguage.name}</span>
            <ChevronDown className="w-3 h-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-40 z-50"
            side="bottom"
            sideOffset={4}
          >
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onSelect={() => handleLanguageChange(language.code)}
                className={`flex items-center gap-3 py-3 px-3 cursor-pointer touch-manipulation ${
                  language.code === userProfile.language ? "bg-primary/10" : ""
                }`}
              >
                <span className="text-base">{language.flag}</span>
                <span className="text-sm">{language.name}</span>
                {language.code === userProfile.language && (
                  <span className="ml-auto text-primary text-xs">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 근처 공공기관 행사 정보 */}
      <div className="flex-1 px-4 py-8 mt-6" style={{background: 'linear-gradient(135deg, #E1DCCA40 0%, #E1DCCA20 100%)'}}>
        <div className="mb-4">
          <h3 className="font-bold text-lg text-gray-800 mb-1">행사/체험/교육 프로그램</h3>
          <p className="text-sm text-gray-600">국가유산을 새롭게 경험해보세요.</p>
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
                <h4 className="font-bold text-xl mb-2">데이터 로딩 오류</h4>
                <p className="text-white/90 text-sm mb-2">{error}</p>
                <Button 
                  onClick={fetchFestivals}
                  variant="outline" 
                  className="text-red-500 border-white hover:bg-white/10"
                >
                  다시 시도
                </Button>
              </div>
            </div>
          </Card>
        ) : festivals.length > 0 ? (
          <div className="space-y-4 h-full overflow-y-auto">
            {festivals.map((festival, index) => (
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
                      진행중
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
                            자세히 보기
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 bg-transparent hover:bg-white/10 text-white font-medium py-2 rounded-lg shadow-lg transition-all duration-200 backdrop-blur-sm border border-white/50 hover:border-white/70 text-sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              // 지도에서 보기 또는 위치 정보
                            }}
                          >
                            위치 보기
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
                <h4 className="font-bold text-xl mb-2">축제 정보 없음</h4>
                <p className="text-white/90 text-sm">현재 진행중인 축제가 없습니다.</p>
              </div>
            </Card>
          </div>
        )}

        {/* ... existing code ... */}
      </div>
    </div>
  )
}
