"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Navigation, Map } from "lucide-react"

export default function MobileNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  // 채팅 페이지나 상세 페이지에서는 네비게이션 숨기기
  if (pathname?.includes('/chat') || pathname?.includes('/detail')) {
    return null
  }

  return (
    <div className="flex border-t bg-card/90 backdrop-blur-sm">
      <Button
        variant={pathname === "/" ? "default" : "ghost"}
        className={`flex-1 flex flex-col items-center gap-1 py-3 h-auto rounded-none ${
          pathname === "/" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
        }`}
        onClick={() => router.push("/")}
      >
        <Navigation className="w-5 h-5" />
        <span className="text-xs">리스트</span>
      </Button>
      <Button
        variant={pathname === "/map" ? "default" : "ghost"}
        className={`flex-1 flex flex-col items-center gap-1 py-3 h-auto rounded-none border-l ${
          pathname === "/map" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
        }`}
        onClick={() => router.push("/map")}
      >
        <Map className="w-5 h-5" />
        <span className="text-xs">지도</span>
      </Button>
    </div>
  )
}