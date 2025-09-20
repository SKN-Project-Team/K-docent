'use client'

import { useState } from 'react'
import { Volume2, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useTranslation } from '@/utils/i18n'

interface NarrationRequestModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  heritageName: string
  narrationMode: 'children' | 'adult'
  onConfirm: () => void
  language: string
}

export function NarrationRequestModal({
  isOpen,
  onOpenChange,
  heritageName,
  narrationMode,
  onConfirm,
  language
}: NarrationRequestModalProps) {
  const { t } = useTranslation(language)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleConfirm = async () => {
    setIsGenerating(true)
    try {
      await onConfirm()
      // 생성 완료 후 모달 닫기
      setTimeout(() => {
        setIsGenerating(false)
        onOpenChange(false)
      }, 2000)
    } catch (error) {
      console.error('나레이션 생성 실패:', error)
      setIsGenerating(false)
    }
  }

  const modeDescription = narrationMode === 'children'
    ? t('narration.childrenModeDescription')
    : t('narration.adultModeDescription')

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary" />
            {t('narration.generateRequest')}
          </DialogTitle>
          <DialogDescription className="text-left">
            {t('narration.generateConfirmation', { heritageName })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">{t('narration.selectedMode')}:</span>
              <span className="text-sm font-semibold text-primary">
                {narrationMode === 'children' ? t('narration.childrenMode') : t('narration.adultMode')}
              </span>
            </div>
            <p className="text-xs text-gray-600">{modeDescription}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{t('narration.generationTime')}</span>
          </div>

          {isGenerating && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <div>
                  <p className="text-sm font-medium text-blue-800">{t('narration.generating')}</p>
                  <p className="text-xs text-blue-600">{t('narration.pleaseWait')}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isGenerating}
            >
              {t('common.cancel')}
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirm}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('narration.generating')}
                </>
              ) : (
                t('narration.generateRequest')
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}