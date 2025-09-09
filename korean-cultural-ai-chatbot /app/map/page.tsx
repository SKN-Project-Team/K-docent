"use client"

import { useApp } from "@/context/AppContext"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

// MapScreen을 클라이언트 사이드에서만 렌더링하도록 동적 import
const MapScreen = dynamic(() => import("@/components/MapScreen"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col min-h-screen bg-background korean-pattern pb-16">
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">지도를 불러오는 중...</p>
        </div>
      </div>
    </div>
  )
})

export default function MapPage() {
  const router = useRouter()
  const { culturalSites, userProfile, setUserProfile, setCurrentLocation } = useApp()

  const handleLocationSelect = (location: any) => {
    setCurrentLocation(location)
    router.push(`/detail/${location.name}`)
  }

  const handleLanguageChange = (lang: string) => {
    setUserProfile((prev) => ({ ...prev, language: lang }))
  }

  const handleViewChange = (view: "location" | "map") => {
    if (view === "location") {
      router.push("/")
    }
  }

  return (
    <MapScreen
      culturalSites={culturalSites}
      userProfile={userProfile}
      onLocationSelect={handleLocationSelect}
      onLanguageChange={handleLanguageChange}
      onViewChange={handleViewChange}
    />
  )
}