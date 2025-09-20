'use client'

import { SimpleHeritageContent } from '@/lib/api/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Volume2, Image as ImageIcon } from 'lucide-react'

interface HeritageCardProps {
  heritage: SimpleHeritageContent
  onNavigate?: (heritage: SimpleHeritageContent) => void
  onPlayAudio?: (heritage: SimpleHeritageContent) => void
}

export function HeritageCard({ heritage, onNavigate, onPlayAudio }: HeritageCardProps) {
  const {
    content_id,
    site_id,
    language,
    name,
    description_summary,
    latitude,
    longitude,
    distance_km,
    image_url,
    has_tts_audio
  } = heritage

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* 이미지가 있으면 표시 */}
      {image_url && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <img
            src={image_url}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // 이미지 로딩 실패 시 숨김
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
              {name}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-600">
              위도: {latitude.toFixed(6)}, 경도: {longitude.toFixed(6)}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1 ml-3">
            <Badge variant="secondary" className="text-xs">
              {language.toUpperCase()}
            </Badge>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              {formatDistance(distance_km)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 설명 */}
        <div>
          <p className="text-sm text-gray-700 line-clamp-3">
            {description_summary}
          </p>
        </div>

        {/* TTS 오디오 정보 */}
        {has_tts_audio && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
            <Volume2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700">음성 해설 이용 가능</span>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto text-xs"
              onClick={() => onPlayAudio?.(heritage)}
            >
              음성 듣기
            </Button>
          </div>
        )}

        {/* 상세보기 버튼 */}
        <Button
          variant="default"
          className="w-full"
          onClick={() => onNavigate?.(heritage)}
        >
          자세히 보기
        </Button>
      </CardContent>
    </Card>
  )
}