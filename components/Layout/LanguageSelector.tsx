'use client'

import { useState } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SUPPORTED_LANGUAGES, getLanguageInfo } from '@/utils/languageUtils'

interface LanguageSelectorProps {
  currentLanguage: string
  onLanguageChange: (languageCode: string) => void
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const currentLangInfo = getLanguageInfo(currentLanguage)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-200 text-gray-700 hover:bg-gray-100 gap-2"
        >
          <Globe className="w-4 h-4" />
          <span className="text-base">{currentLangInfo?.flag}</span>
          <span className="text-sm hidden sm:inline">{currentLangInfo?.nativeName}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 z-50">
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onSelect={() => onLanguageChange(language.code)}
            className={`flex items-center gap-3 py-3 px-3 cursor-pointer touch-manipulation ${
              language.code === currentLanguage ? "bg-primary/10" : ""
            }`}
          >
            <span className="text-base">{language.flag}</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{language.nativeName}</span>
              <span className="text-xs text-gray-500">{language.name}</span>
            </div>
            {language.code === currentLanguage && (
              <span className="ml-auto text-primary text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}