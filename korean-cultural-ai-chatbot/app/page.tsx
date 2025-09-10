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
import { Search, Menu, ChevronDown, ArrowRight } from "lucide-react"
import { useState } from "react"
import { getTranslatedText, uiTexts } from "@/utils/translation"

export default function Home() {
  const router = useRouter()
  const { culturalSites, userProfile, setUserProfile } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  
  // 필터 상태 추가
  const [companionFilter, setCompanionFilter] = useState("아이와 함께")
  const [locationFilter, setLocationFilter] = useState("경복궁") // 기본값을 "전체"로 변경
  
  // 축제 선택 상태
  const [selectedFestival, setSelectedFestival] = useState(0)
  
  // 축제 데이터 (실제 이미지 적용)
  const festivals = [
    {
      title: "2024년 제1기 국가유산교육전문가 양성과정(기본교육)",
      date: "2024.03.05 ~ 03.07",
      place: "집합연수 3박 4일",
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop&crop=center", // 교육 세미나
      icon: "🎓",
      location: "국가유산진흥원",
      description: "국가유산 교육 전문가로 성장할 수 있는 기회",
      badgeColor: "bg-green-100 text-green-800",
      bgColor: "from-green-500 to-emerald-600"
    },
    {
      title: "2024년 국가유산교육 수업안 경진대회",
      date: "2024.05.31 ~ 09.02",
      place: "온라인 접수",
      img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop&crop=center", // 상장, 트로피
      icon: "🏆",
      location: "국가유산진흥원",
      description: "학교 현장에서 활용 가능한 수업안 발굴",
      badgeColor: "bg-purple-100 text-purple-800",
      bgColor: "from-purple-500 to-indigo-600"
    },
    {
      title: "국가유산꿈쟁이 교육프로그램",
      date: "상시 운영",
      place: "각 지역별 교육장",
      img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop&crop=center", // 어린이 교육
      icon: "🧒",
      location: "국가유산진흥원",
      description: "어린이들을 위한 국가유산 체험 교육",
      badgeColor: "bg-yellow-100 text-yellow-800",
      bgColor: "from-yellow-500 to-orange-600"
    },
    {
      title: "2025년 무형유산 전수교육관 활성화 지원사업",
      date: "2024.04.30까지 신청",
      place: "전국 전수교육관",
      img: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop&crop=center", // 한국 전통 건물
      icon: "🏢",
      location: "국가유산진흥원",
      description: "전국 전수교육관의 무형유산 교육·체험 지원",
      badgeColor: "bg-indigo-100 text-indigo-800",
      bgColor: "from-indigo-500 to-cyan-600"
    }
  ]

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
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <h1 className="font-app-title font-bold text-xl text-gray-800">K-Docent</h1>
        </div>
      </div>
      

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
                      <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1 backdrop-blur-sm">
                        <span className="text-xs font-medium text-gray-800">★ 4.8</span>
                      </div>
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
      <div className="px-4 py-8 mt-6" style={{backgroundColor: 'rgba(162, 74, 0, 0.1)'}}>
        <div className="mb-4">
          <h3 className="font-bold text-lg text-gray-800 mb-1">행사/체험/교육 프로그램</h3>
          <p className="text-sm text-gray-600">국가유산을 새롭게 경험해보세요.</p>
        </div>

        {/* 메인 이벤트 카드 - 동적 변경 */}
        <Card 
          className="mb-4 overflow-hidden text-white relative cursor-pointer transition-all duration-500"
          onClick={() => {/* 메인 카드 클릭 시 대응 로직 */}}
          style={{
            backgroundImage: festivals[selectedFestival].img ? `url(${festivals[selectedFestival].img})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '200px'
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative p-6 z-10">
            <div className="flex justify-between items-start mb-4">
              <Badge className="bg-white/20 text-white text-xs">
                {festivals[selectedFestival].location}
              </Badge>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-2">{festivals[selectedFestival].title}</h4>
              <p className="text-white/90 text-sm mb-2">{festivals[selectedFestival].description}</p>
              <p className="text-white/70 text-xs">{festivals[selectedFestival].date} | {festivals[selectedFestival].place}</p>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 translate-x-12"></div>
        </Card>

        {/* 작은 이벤트 카드들 */}
        <div className="space-y-3">
          {festivals.map((festival, index) => {
            if (index === selectedFestival) return null; // 선택된 축제는 작은 카드에서 숨김
            return (
              <Card 
                key={index}
                className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 hover:border-primary/30 hover:bg-gray-50"
                onClick={() => setSelectedFestival(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="space-y-2 py-1">
                      <Badge className="bg-black/20 text-gray text-xs mb-2">
                        {festivals[selectedFestival].location}
                      </Badge>
                      <h5 className="font-medium text-sm text-gray-800 leading-tight">{festival.title}</h5>
                      <p className="text-xs text-gray-600 leading-relaxed">{festival.date} | {festival.place}</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  )
}
