"use client"

import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, RotateCcw, ChevronDown } from "lucide-react"
import { useState } from "react"
import { getTranslatedText, uiTexts } from "@/utils/translation"

export default function Home() {
  const router = useRouter()
  const { culturalSites, userProfile, setUserProfile } = useApp()
  const [searchQuery, setSearchQuery] = useState("")

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

  // 검색 필터링된 문화유적지
  const filteredSites = culturalSites.filter(site => 
    getTranslatedText(site.name, userProfile.language).toLowerCase().includes(searchQuery.toLowerCase()) ||
    getTranslatedText(site.description, userProfile.language).toLowerCase().includes(searchQuery.toLowerCase()) ||
    getTranslatedText(site.category, userProfile.language).toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen bg-background korean-pattern pb-16">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card dancheong-accent">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 bg-primary shadow-lg">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">{getTranslatedText(uiTexts.avatarLetter, userProfile.language)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-xl text-primary">{getTranslatedText(uiTexts.appTitle, userProfile.language)}</h1>
            <p className="text-sm text-muted-foreground">{getTranslatedText(uiTexts.appSubtitle, userProfile.language)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
      </div>

      {/* Location Cards - Vertical Scroll */}
      <div className="flex-1">
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={getTranslatedText(uiTexts.searchPlaceholder, userProfile.language)}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-4 pr-10 py-2 border-primary/20 focus:border-primary"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-primary/10 text-primary ml-2"
              onClick={() => {
                console.log('Refreshing cultural sites...')
                setSearchQuery("") // 검색어도 초기화
              }}
              title={getTranslatedText(uiTexts.refreshTitle, userProfile.language)}
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="px-4 pb-6">
          <div className="space-y-4">
            {filteredSites.length === 0 && searchQuery ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="font-medium text-lg text-primary mb-2">{getTranslatedText(uiTexts.noResultsTitle, userProfile.language)}</h3>
                <p className="text-sm text-muted-foreground">{getTranslatedText(uiTexts.noResultsDescription, userProfile.language)}</p>
              </div>
            ) : (
              filteredSites.map((site, idx) => (
              <Card
                key={idx}
                className={`relative overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/30 w-full group`}
                onClick={() => handleLocationSelect(getTranslatedText(site.name, userProfile.language))}
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
                  {/* Top Section with Badge */}
                  <div className="flex items-start justify-end mb-4">
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800 shadow-lg backdrop-blur-sm">
                        {getTranslatedText(uiTexts.aiNarration, userProfile.language)}
                      </Badge>
                      <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1 backdrop-blur-sm">
                        <span className="text-xs font-medium text-gray-800">★ 4.8</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="font-bold text-2xl mb-3 drop-shadow-lg filter">{getTranslatedText(site.name, userProfile.language)}</h3>
                    <p className="text-sm leading-relaxed mb-4 line-clamp-3 text-white/90 drop-shadow-sm">{getTranslatedText(site.description, userProfile.language)}</p>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-white/80">
                        <span className="font-medium">{site.distance}km</span>
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
                        handleLocationSelect(getTranslatedText(site.name, userProfile.language))
                      }}
                    >
                      {getTranslatedText(site.buttonText!, userProfile.language)}
                    </Button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-10"></div>
              </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}