"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Navigation, Users, BookOpen } from "lucide-react"
import { useApp } from "@/context/AppContext"
import { getTranslatedText, uiTexts } from "@/utils/translation"

export default function MobileNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { userProfile } = useApp()

  // 상세 페이지에서도 네비게이션 표시하도록 주석 처리
  // if (pathname?.includes('/detail')) {
  //   return null
  // }

  const navItems = [
    {
      path: "/",
      icon: Home,
      label: "홈",
      isActive: pathname === "/"
    },
    {
      path: "/map",
      icon: Navigation,
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
      path: "/magazine",
      icon: BookOpen,
      label: "매거진",
      isActive: pathname?.includes('/magazine')
    }
  ]

  return (
    <div className="flex border-t bg-white backdrop-blur-sm">
      {navItems.map((item, index) => {
        const IconComponent = item.icon
        return (
          <Button
            key={item.path}
            variant="ghost"
            className="flex-1 flex flex-col items-center gap-1 py-3 h-auto rounded-none bg-white hover:bg-gray-50"
            onClick={() => router.push(item.path)}
          >
            <IconComponent className={`w-5 h-5 ${
              item.isActive ? "text-black" : "text-gray-400"
            }`} />
            <span className={`text-xs ${
              item.isActive ? "text-black" : "text-gray-400"
            }`}>{item.label}</span>
          </Button>
        )
      })}
    </div>
  )
}