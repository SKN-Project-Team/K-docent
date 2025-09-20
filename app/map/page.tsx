"use client"

import { useRouter } from "next/navigation"
import MapExample from "@/components/MapExample"
import { AppHeader } from "@/components/Layout/AppHeader"
import { BottomNavigation } from "@/components/Layout/BottomNavigation"
import { LanguageModal } from "@/components/Layout/LanguageModal"
import { useApp } from "@/context/AppContext"
import { setStoredLanguage, validateLanguageCode } from "@/utils/languageUtils"
import { Home } from "lucide-react"

export default function MapPage() {
  const router = useRouter()
  const { userProfile, setUserProfile } = useApp()

  const handleLanguageChange = (lang: string) => {
    const validatedLang = validateLanguageCode(lang)
    setStoredLanguage(validatedLang) // 세션 스토리지에 저장
    setUserProfile((prev) => ({ ...prev, language: validatedLang }))
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <AppHeader
          className="bg-white"
          title="K-Docent"
          subtitle="지도"
          onBack={() => router.back()}
          actions={[
            {
              key: "language-modal",
              component: (
                <LanguageModal
                  currentLanguage={userProfile.language}
                  onLanguageChange={handleLanguageChange}
                />
              )
            }
          ]}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <MapExample />
      </div>

      <BottomNavigation />
    </div>
  )
}
