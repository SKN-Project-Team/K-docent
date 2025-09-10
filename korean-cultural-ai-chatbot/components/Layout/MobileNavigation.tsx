"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Navigation, Map, Users, MessageCircle } from "lucide-react"
import { useApp } from "@/context/AppContext"
import { getTranslatedText, uiTexts } from "@/utils/translation"

export default function MobileNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { userProfile } = useApp()

  // 상세 페이지에서는 네비게이션 숨기기 (채팅은 탭에 포함되므로 제외)
  if (pathname?.includes('/detail')) {
    return null
  }

  const navItems = [
    {
      path: "/",
      icon: Navigation,
      label: "홈",
      isActive: pathname === "/"
    },
    {
      path: "/map",
      icon: Map,
      label: "지도",
      isActive: pathname === "/map"
    },
    {
      path: "/community",
      icon: Users,
      label: "커뮤니티",
      isActive: pathname === "/community"
    },
    {
      path: "/chat",
      icon: MessageCircle,
      label: "채팅",
      isActive: pathname?.includes('/chat')
    }
  ]

  return (
    <div className="flex border-t bg-card/90 backdrop-blur-sm">
      {navItems.map((item, index) => {
        const IconComponent = item.icon
        return (
          <Button
            key={item.path}
            variant={item.isActive ? "default" : "ghost"}
            className={`flex-1 flex flex-col items-center gap-1 py-3 h-auto rounded-none ${
              index > 0 ? "border-l" : ""
            } ${
              item.isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
            onClick={() => router.push(item.path)}
          >
            <IconComponent className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        )
      })}
    </div>
  )
}