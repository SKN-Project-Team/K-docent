'use client'

import { useRouter, usePathname } from "next/navigation"
import { Map, Home, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/utils/i18n"
import { useApp } from "@/context/AppContext"

const getNavigationItems = (t: (key: string) => string) => [
  {
    name: t('nav.home'),
    href: "/",
    icon: Home,
  },
  {
    name: t('nav.map'),
    href: "/map",
    icon: Map,
  },
  {
    name: t('nav.chat'),
    href: "/chat",
    icon: MessageCircle,
  },
]

export function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { userProfile } = useApp()
  const { t } = useTranslation(userProfile.language)

  const navigationItems = getNavigationItems(t)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-1 text-xs font-medium transition-colors duration-200",
                isActive
                  ? "text-primary"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 mb-1",
                  isActive ? "text-primary" : "text-gray-500"
                )}
              />
              <span className="truncate">{item.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}