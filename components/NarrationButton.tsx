'use client'

import { useState } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/utils/i18n'

interface NarrationButtonProps {
  hasAudio: boolean
  isPlaying?: boolean
  onPlayToggle?: () => void
  onRequestGeneration?: () => void
  className?: string
  size?: 'sm' | 'default' | 'lg'
  language: string
}

export function NarrationButton({
  hasAudio,
  isPlaying = false,
  onPlayToggle,
  onRequestGeneration,
  className,
  size = 'sm',
  language
}: NarrationButtonProps) {
  const { t } = useTranslation(language)
  const handleClick = () => {
    if (hasAudio) {
      onPlayToggle?.()
    } else {
      onRequestGeneration?.()
    }
  }

  return (
    <Button
      variant={hasAudio ? (isPlaying ? "default" : "secondary") : "outline"}
      size={size}
      className={`gap-2 ${className || ''}`}
      onClick={handleClick}
    >
      {hasAudio ? (
        <>
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span className="text-xs">
            {isPlaying ? t('narration.pause') : t('narration.play')}
          </span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4" />
          <span className="text-xs">{t('narration.generate')}</span>
        </>
      )}
    </Button>
  )
}