"use client"

import { useRouter } from "next/navigation"
import MapExample from "@/components/MapExample"
import { AppHeader } from "@/components/Layout/AppHeader"
import { Home } from "lucide-react"

export default function MapPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <AppHeader
          className="bg-white"
          title="K-Docent"
          subtitle="지도"
          onBack={() => router.back()}
          actions={[{
            key: "home",
            icon: <Home className="w-5 h-5 text-gray-600" />,
            onClick: () => router.push("/"),
            variant: "ghost",
            className: "p-2 rounded-full hover:bg-gray-100",
            ariaLabel: "홈으로 이동",
          }]}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <MapExample />
      </div>
    </div>
  )
}
