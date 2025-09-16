"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageCircle, MapPin, Play, Pause, Volume2 } from "lucide-react"
import { LocationData } from "@/types"
import { getTranslatedText } from "@/utils/translation"
// 상단 imports에 수정
import VoicePicker, { VoiceItem } from "@/components/VoicePicker"

type Difficulty = "basic" | "standard" | "advanced"
type Voice = "warm" | "calm" | "bright"

interface DetailScreenProps {
  location: LocationData
  onBackToList: () => void
  onChatOpen: () => void
  userLanguage: string
}

export default function DetailScreen({
  location,
  onBackToList,
  onChatOpen,
  userLanguage
}: DetailScreenProps) {
  const [isPlaying, setIsPlaying] = useState<string | null>(null)

  // 🔊 사용자 옵션 (전역)
  const [difficulty, setDifficulty] = useState<Difficulty>("standard")
  const [voice, setVoice] = useState<Voice>("rumi")

  // 샘플 데이터(실제 이미지 경로로 바꿔줘)
  const voiceItems: VoiceItem[] = [
    { id: "warm", name: "따뜻한 목소리", ageGroup: "Adults", tone: "Warm", image: "/voices/warm.jpeg", pro: true, previewUrl: "/voices/warm.mp3" },
    { id: "calm", name: "차분한 목소리", ageGroup: "Adults", tone: "Calm", image: "/voices/calm.jpeg", pro: false, previewUrl: "/voices/calm.mp3" },
    { id: "bright", name: "개구진 목소리", ageGroup: "Adults", tone: "Bright", image: "/voices/bright.jpeg", pro: false, previewUrl: "/voices/bright.mp3" },
  ]

  const handlePlayNarration = (placeId: string) => {
    // 여기에 실제 오디오 TTS 호출 시, difficulty/voice 옵션을 함께 전달하세요.
    // playNarration(placeId, { difficulty, voice })
    setIsPlaying(prev => (prev === placeId ? null : placeId))
  }

  const labelByDifficulty: Record<Difficulty, string> = {
    basic: "초급",
    standard: "표준",
    advanced: "심화",
  }

  const labelByVoice: Record<Voice, string> = {
    warm: "따뜻한 목소리",
    calm: "차분한 목소리",
    bright: "개구진 목소리",
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToList}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>

          {location.backgroundImage && (
            <div
              aria-hidden
              className="w-10 h-10 rounded-full shadow-md overflow-hidden border-2 border-white flex-shrink-0"
              style={{
                backgroundImage: `url(${location.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}

          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-gray-900 truncate">
              {getTranslatedText(location.name, userLanguage)}
            </h1>
            <p className="text-sm text-gray-600 truncate flex items-center gap-1">
              <span>{getTranslatedText(location.category, userLanguage)}</span>
              <span>•</span>
              <MapPin className="w-3.5 h-3.5 opacity-70" />
              <span>{location.distance}km</span>
            </p>
          </div>
        </div>

        <Button
          onClick={onChatOpen}
          className="text-white shadow-md rounded-lg px-3 py-2 transition-all duration-200 flex-shrink-0 ml-2"
          aria-label="채팅 열기"
          style={{backgroundColor: '#556B2F'}}
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          채팅
        </Button>
      </div>

      {/* 🔧 사용자 컨트롤 바 (난이도 선택 + 목소리 선택) */}
      <div className="px-4 mt-6">
        <Card className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="space-y-4">
            {/* 난이도 */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-800">지식 난이도</span>
              <div className="flex rounded-xl bg-gray-100 p-1">
                {(["basic", "standard", "advanced"] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition
                      ${difficulty === d
                        ? "bg-white shadow border border-gray-200 text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                      }`}
                    aria-pressed={difficulty === d}
                    aria-label={`난이도 ${labelByDifficulty[d]}`}
                  >
                    {labelByDifficulty[d]}
                  </button>
                ))}
              </div>
            </div>

            {/* 목소리 선택 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-gray-800">목소리</span>
                <span className="text-xs text-gray-500">(탭/클릭하여 선택)</span>
              </div>
              <VoicePicker
                voices={voiceItems}
                selectedVoice={voice}
                onVoiceSelect={(id: string) => setVoice(id as Voice)}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* 세부 장소 목록 */}
      <div className="flex-1 px-4 mt-6">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 mb-0.5">세부 장소</h3>
          <p className="text-sm text-gray-600">각 장소의 AI 나레이션을 들어보세요.</p>
        </div>

        <div className="space-y-3 pb-2">
          {location.detailPlaces?.map((place) => {
            const title = getTranslatedText(place.name, userLanguage)
            const category = getTranslatedText(place.category, userLanguage)
            const desc = getTranslatedText(place.description, userLanguage)

            return (
              <Card
                key={place.id}
                className="relative overflow-hidden bg-white border border-gray-200 hover:border-amber-700 transition-all duration-300 hover:shadow-md rounded-xl"
              >
                <div className="p-3">
                  <div className="flex gap-3">
                    {/* ✅ 이미지: 고정 16:9 비율 */}
                    <button
                      type="button"
                      onClick={() => handlePlayNarration(place.id)}
                      className="group relative w-30 md:w-24 aspect-[4/3] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      aria-label={`${title} 나레이션 ${isPlaying === place.id ? "일시정지" : "재생"}`}
                    >
                      {place.image ? (
                        <img
                          src={place.image}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🏛️</div>
                      )}

                      {/* 좌상단: 재생 시간 */}
                      <div className="absolute top-0 left-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/85 backdrop-blur border border-gray-200 text-gray-800 font-medium">
                          AI {place.narrationDuration}
                        </span>
                      </div>

                      {/* 중앙: 재생/일시정지 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/35 group-hover:bg-black/50 transition">
                          {isPlaying === place.id ? (
                            <Pause className="w-4 h-4 text-white" />
                          ) : (
                            <Play className="w-4 h-4 text-white" />
                          )}
                        </span>
                      </div>
                    </button>

                    {/* 텍스트 */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="mb-1.5">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">{title}</h3>
                          <Badge
                            variant="default"
                            className="text-[10px] text-gray-900"
                            style={{ backgroundColor: '#F5F5DC' }}
                          >
                            {category}
                          </Badge>
                        </div>

                        <p className="text-xs text-gray-700 leading-5 line-clamp-2">
                          {desc}
                        </p>
                      </div>

                      {/* 하단: 하이라이트 + 선택 옵션 미니표시 */}
                      <div className="mt-auto pt-1 flex flex-wrap items-center gap-1">
                        {place.highlights.map((h, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-[10px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            {getTranslatedText(h, userLanguage)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 재생 중 오버레이 */}
                {isPlaying === place.id && (
                  <div
                    className="pointer-events-none absolute inset-0 bg-amber-50/70 border-2 border-amber-200 rounded-xl flex items-center justify-center backdrop-blur-[2px]"
                    aria-hidden
                  >
                    <div className="bg-amber-600/90 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg">
                      <Volume2 className="w-3 h-3 animate-pulse" />
                      {labelByVoice[voice]} · {labelByDifficulty[difficulty]} · 나레이션 재생 중...
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
