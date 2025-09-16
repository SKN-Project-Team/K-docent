"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Globe, Navigation, Star, RotateCcw, Map, MapPin, Volume2 } from "lucide-react"
import { LocationData } from "@/types"

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
  return (
    <div className="flex flex-col h-screen bg-background korean-pattern">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card dancheong-accent">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 bg-primary shadow-lg">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">한</AvatarFallback>
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

      {/* Location Cards - Vertical Scroll */}
      <div className="flex-1 overflow-hidden">
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
                    <div className="text-5xl mb-2 drop-shadow-2xl filter">{site.illustration}</div>
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
                        onLocationSelect(site)
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
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="flex border-t bg-card/90 backdrop-blur-sm">
        <Button
          variant="default"
          className="flex-1 flex flex-col items-center gap-1 py-3 h-auto rounded-none bg-primary text-primary-foreground"
        >
          <Navigation className="w-5 h-5" />
          <span className="text-xs">리스트</span>
        </Button>
        <Button
          variant="ghost"
          className="flex-1 flex flex-col items-center gap-1 py-3 h-auto rounded-none border-l text-muted-foreground"
          onClick={() => onViewChange("map")}
        >
          <Map className="w-5 h-5" />
          <span className="text-xs">지도</span>
        </Button>
      </div>
    </div>
  )
}