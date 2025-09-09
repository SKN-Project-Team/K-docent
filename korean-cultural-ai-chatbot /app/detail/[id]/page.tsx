"use client"

import { useApp } from "@/context/AppContext"
import DetailScreen from "@/components/DetailScreen"
import { useRouter } from "next/navigation"

interface DetailPageProps {
  params: { id: string }
}

export default function DetailPage({ params }: DetailPageProps) {
  const router = useRouter()
  const { culturalSites, setCurrentLocation } = useApp()

  // URL의 id와 매칭되는 문화재 찾기
  const location = culturalSites.find(site => site.name === decodeURIComponent(params.id))

  if (!location) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>해당 문화재를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const handleBackToList = () => {
    router.push("/")
  }

  const handleChatOpen = () => {
    setCurrentLocation(location)
    router.push("/chat")
  }

  return (
    <DetailScreen
      location={location}
      onBackToList={handleBackToList}
      onChatOpen={handleChatOpen}
    />
  )
}