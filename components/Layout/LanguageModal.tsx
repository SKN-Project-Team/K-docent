'use client'

import { useState } from 'react'
import { Globe, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SUPPORTED_LANGUAGES, getLanguageInfo } from '@/utils/languageUtils'

interface LanguageModalProps {
  currentLanguage: string
  onLanguageChange: (languageCode: string) => void
}

export function LanguageModal({ currentLanguage, onLanguageChange }: LanguageModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentLangInfo = getLanguageInfo(currentLanguage)

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageChange(languageCode)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-200 text-gray-700 hover:bg-gray-100 gap-2"
        >
          <Globe className="w-4 h-4" />
          <span className="text-base">{currentLangInfo?.flag}</span>
          <span className="text-sm hidden sm:inline">{currentLangInfo?.nativeName}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            언어 선택
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {SUPPORTED_LANGUAGES.map((language) => (
            <Button
              key={language.code}
              variant={language.code === currentLanguage ? "default" : "outline"}
              className={`justify-start h-auto py-4 px-4 ${
                language.code === currentLanguage
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => handleLanguageSelect(language.code)}
            >
              <div className="flex items-center gap-3 w-full">
                <span className="text-xl">{language.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{language.nativeName}</span>
                  <span className="text-sm opacity-70">{language.name}</span>
                </div>
                {language.code === currentLanguage && (
                  <span className="ml-auto text-sm">✓</span>
                )}
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}