"use client"

import { useId } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Volume2, PlayCircle, Play } from "lucide-react"

export type VoiceItem = {
  id: string
  name: string           // 라벨 (예: 라미)
  ageGroup?: "Child" | "Adults"
  tone?: string          // 예: Sweet, Calm
  pro?: boolean
  isPro?: boolean        // 추가된 속성
  isNew?: boolean        // 추가된 속성
  tags?: string[]        // 추가된 속성
  image: string          // 얼굴 썸네일
  previewUrl?: string    // 미리듣기(선택)
}

interface VoicePickerProps {
  voices: VoiceItem[]
  selectedVoice: string
  onVoiceSelect: (id: string) => void
  className?: string
}

export default function VoicePicker({ voices, selectedVoice, onVoiceSelect, className }: VoicePickerProps) {
  return (
    <div>
      <div className={cn("grid grid-cols-4 gap-2", className)}>
        {voices.map((voice) => (
          <button
            key={voice.id}
            onClick={() => onVoiceSelect(voice.id)}
            className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 aspect-square ${
              selectedVoice === voice.id
                ? 'border-amber-700 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="relative w-full h-full">
              <img
                src={voice.image}
                alt={voice.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-white/20 p-1 backdrop-blur-sm">
                  <Play className="h-2.5 w-2.5 fill-white text-white" />
                </div>
              </div>
              
              {voice.tags && (
                <div className="absolute bottom-0 left-0 right-0 p-1">
                  <div className="flex flex-wrap gap-0.5">
                    {voice.tags.slice(0, 2).map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded bg-white/80 px-1 py-0.5 text-[9px] font-medium text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 이름과 신규 배지를 이미지 영역 내부로 이동 */}
              <div className="absolute bottom-1 left-1 right-1">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xs font-medium text-white drop-shadow-md truncate text-center">{voice.name}</span>
                  {voice.isNew && (
                    <span className="rounded bg-red-500 px-1 py-0.5 text-[9px] font-bold text-white flex-shrink-0">
                      신규
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {selectedVoice === voice.id && (
              <div className="absolute right-1 top-1">
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
