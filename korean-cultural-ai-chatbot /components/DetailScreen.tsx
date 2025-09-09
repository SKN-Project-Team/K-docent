"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, MessageCircle, MapPin, Play, Pause, Volume2 } from "lucide-react"
import { LocationData } from "@/types"

interface DetailScreenProps {
  location: LocationData
  onBackToList: () => void
  onChatOpen: () => void
}

export default function DetailScreen({
  location,
  onBackToList,
  onChatOpen
}: DetailScreenProps) {
  const [isPlaying, setIsPlaying] = useState<string | null>(null)

  const handlePlayNarration = (placeId: string) => {
    if (isPlaying === placeId) {
      setIsPlaying(null)
    } else {
      setIsPlaying(placeId)
    }
  }
  return (
    <div className="flex flex-col min-h-screen bg-background korean-pattern pb-16">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card dancheong-accent">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToList}
            className="p-2 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 text-primary" />
          </Button>
          {location.backgroundImage && (
            <div 
              className="w-12 h-12 rounded-full shadow-lg overflow-hidden"
              style={{
                backgroundImage: `url(${location.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          )}
          <div>
            <h1 className="font-bold text-xl text-primary">{location.name}</h1>
            <p className="text-sm text-muted-foreground">{location.category} • {location.distance}km</p>
          </div>
        </div>
        
        {/* 채팅 버튼을 헤더로 이동 */}
        <Button
          onClick={onChatOpen}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          채팅
        </Button>
      </div>

      {/* 장소 소개 */}
      <div className="p-4 bg-muted/30 border-b">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {location.description}
        </p>
      </div>

      {/* 세부 장소 목록 */}
      <div className="flex-1">
        <div className="p-4">
          <div className="space-y-4">
            {location.detailPlaces?.map((place) => (
              <Card
                key={place.id}
                className="relative overflow-hidden border-2 border-transparent hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex gap-4 p-4">
                  {/* 이미지 */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                    {place.image ? (
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        🏛️
                      </div>
                    )}
                  </div>

                  {/* 콘텐츠 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-primary mb-1">{place.name}</h3>
                        <Badge variant="outline" className="text-xs border-primary/20 text-primary mb-2">
                          {place.category}
                        </Badge>
                      </div>
                      <Button
                        variant={isPlaying === place.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePlayNarration(place.id)}
                        className={`flex-shrink-0 ${
                          isPlaying === place.id
                            ? "bg-primary text-primary-foreground"
                            : "border-primary/20 hover:border-primary/40"
                        }`}
                      >
                        {isPlaying === place.id ? (
                          <Pause className="w-4 h-4 mr-1" />
                        ) : (
                          <Play className="w-4 h-4 mr-1" />
                        )}
                        <span className="text-xs">{place.narrationDuration}</span>
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {place.description}
                    </p>

                    {/* 하이라이트 */}
                    <div className="flex flex-wrap gap-1">
                      {place.highlights.map((highlight, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs bg-secondary/60 text-secondary-foreground"
                        >
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 재생 중 표시 */}
                {isPlaying === place.id && (
                  <div className="absolute inset-0 bg-primary/5 border-2 border-primary/20 rounded-lg flex items-center justify-center">
                    <div className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                      <Volume2 className="w-3 h-3 animate-pulse" />
                      나레이션 재생 중...
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}