"use client"

import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Globe, RotateCcw, MapPin, Volume2, Star } from "lucide-react"
import { useState } from "react"

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

  // 검색 필터링된 문화유적지
  const filteredSites = culturalSites.filter(site => 
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen bg-background korean-pattern pb-16">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card dancheong-accent">
        <div>
          <h1 className="font-bold text-xl text-primary">한국문화 AI 가이드</h1>
          <p className="text-sm text-muted-foreground">전통과 현대가 만나는 문화 여행</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLanguageChange(userProfile.language === "ko" ? "en" : "ko")}
            className="border-primary/20"
          >
            <Globe className="w-4 h-4" />
            {userProfile.language === "ko" ? "EN" : "한"}
          </Button>
        </div>
      </div>

      {/* Location Cards - Vertical Scroll */}
      <div className="flex-1">
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="문화유적지를 검색하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-4 py-2 border-primary/20 focus:border-primary"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-primary/10 text-primary ml-2"
              onClick={() => {
                console.log('Refreshing cultural sites...')
                setSearchQuery("") // 검색어도 초기화
              }}
              title="주변 문화유적지 새로고침"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="px-4 pb-6">
          <div className="space-y-4">
            {filteredSites.length === 0 && searchQuery ? (
              <div className="text-center py-8">
                <h3 className="font-medium text-lg text-primary mb-2">검색 결과가 없습니다</h3>
                <p className="text-sm text-muted-foreground">다른 키워드로 검색해보세요</p>
              </div>
            ) : (
              filteredSites.map((site, idx) => (
              <Card
                key={idx}
                className={`relative overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/30 w-full group`}
                onClick={() => handleLocationSelect(site.name)}
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
                        <Volume2 className="w-3 h-3 mr-1" />
                        AI 나레이션
                      </Badge>
                      <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1 backdrop-blur-sm">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium text-gray-800">4.8</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="font-bold text-2xl mb-3 drop-shadow-lg filter">{site.name}</h3>
                    <p className="text-sm leading-relaxed mb-4 line-clamp-3 text-white/90 drop-shadow-sm">{site.description}</p>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-white/80">
                        <MapPin className="w-3 h-3" />
                        <span className="font-medium">{site.distance}km</span>
                      </div>
                      <Badge variant="outline" className="border-white/50 text-white/90 bg-white/10 backdrop-blur-sm">
                        {site.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    <Button
                      className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-4 rounded-xl shadow-lg transition-all duration-200 text-base backdrop-blur-sm border border-white/30 hover:border-white/50"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLocationSelect(site.name)
                      }}
                    >
                      {site.buttonText || "지금 둘러볼게요"}
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