import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import "./globals.css"
import { AppProvider } from "@/context/AppContext"
import MobileNavigation from "@/components/Layout/MobileNavigation"

export const metadata: Metadata = {
  title: "한국문화 AI 가이드",
  description: "전통과 현대가 만나는 문화 여행",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head></head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AppProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <MobileNavigation />
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
