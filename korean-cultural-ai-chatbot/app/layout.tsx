"use client"

import type React from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense, useState } from "react"
import "./globals.css"
import { AppProvider } from "@/context/AppContext"
import MobileNavigation from "@/components/Layout/MobileNavigation"
import SplashScreen from "@/components/SplashScreen"



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <html lang="ko">
      <head>
        <title>한국문화 AI 가이드</title>
        <meta name="description" content="전통과 현대가 만나는 문화 여행" />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`} style={{fontFamily: "'SangjuGyeongcheonSeom', var(--font-geist-sans), sans-serif"}}>
        <AppProvider>
          {showSplash && (
            <SplashScreen onComplete={handleSplashComplete} />
          )}
          {!showSplash && (
            <>
              <Suspense fallback={null}>{children}</Suspense>
              <div className="fixed bottom-0 left-0 right-0 z-50">
                <MobileNavigation />
              </div>
            </>
          )}
        </AppProvider>
      </body>
    </html>
  )
}
