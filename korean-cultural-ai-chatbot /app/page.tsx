"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Send, Mic, Globe, Users, Clock, Volume2, Map, Navigation, Star } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  location?: string
  sources?: string[]
}

interface LocationData {
  name: string
  description: string
  coordinates: { lat: number; lng: number }
  distance?: number
  hasNarration: boolean
  category: string
  color?: string
  illustration?: string
  buttonText?: string
  backgroundImage?: string
}

const culturalSites: LocationData[] = [
  {
    name: "경복궁",
    description: "조선왕조의 정궁으로 웅장한 근정전과 경회루가 있는 대표적인 궁궐",
    coordinates: { lat: 37.578617, lng: 126.977041 },
    distance: 0.1,
    hasNarration: true,
    category: "궁궐",
    color: "bg-gradient-to-br from-red-100 to-red-200",
    illustration: "🏯",
    buttonText: "지금 둘러볼게요",
    backgroundImage: "/images/gyeongbokgung.jpg", // 경복궁 이미지
  },
  {
    name: "창덕궁",
    description: "자연과 조화를 이룬 아름다운 후원이 있는 유네스코 세계문화유산",
    coordinates: { lat: 37.579617, lng: 126.991169 },
    distance: 0.3,
    hasNarration: true,
    category: "궁궐",
    color: "bg-gradient-to-br from-green-100 to-green-200",
    illustration: "🌸",
    buttonText: "지금 둘러볼게요",
    backgroundImage: "/images/changdeokgung.jpg", // 창덕궁 야경 이미지
  },
  {
    name: "덕수궁",
    description: "서양식과 한국 전통이 어우러진 독특한 건축양식의 근대 궁궐",
    coordinates: { lat: 37.565834, lng: 126.975068 },
    distance: 0.5,
    hasNarration: true,
    category: "궁궐",
    color: "bg-gradient-to-br from-blue-100 to-blue-200",
    illustration: "🏛️",
    buttonText: "지금 둘러볼게요",
    backgroundImage: "/images/deoksugung.jpg", // 덕수궁 석조전 이미지
  },
  {
    name: "종묘",
    description: "조선왕조 역대 왕과 왕비의 신위를 모신 엄숙하고 신성한 사당",
    coordinates: { lat: 37.574147, lng: 126.993229 },
    distance: 0.4,
    hasNarration: true,
    category: "사당",
    color: "bg-gradient-to-br from-purple-100 to-purple-200",
    illustration: "⛩️",
    buttonText: "지금 둘러볼게요",
    backgroundImage: "/images/jongmyo.jpg", // 종묘 이미지
  },
  {
    name: "북촌한옥마을",
    description: "600년 역사의 전통 한옥들이 그대로 보존된 살아있는 문화유산",
    coordinates: { lat: 37.582075, lng: 126.983559 },
    distance: 0.2,
    hasNarration: true,
    category: "마을",
    color: "bg-gradient-to-br from-yellow-100 to-orange-200",
    illustration: "🏘️",
    buttonText: "지금 둘러볼게요",
    backgroundImage: "/images/bukchon.jpg", // 북촌한옥마을 이미지
  },
  {
    name: "인사동",
    description: "전통문화와 현대 예술이 만나는 특별한 문화예술의 거리",
    coordinates: { lat: 37.571607, lng: 126.985641 },
    distance: 0.6,
    hasNarration: true,
    category: "문화거리",
    color: "bg-gradient-to-br from-teal-100 to-cyan-200",
    illustration: "🎨",
    buttonText: "지금 둘러볼게요",
    backgroundImage: "/images/insadong.jpg", // 인사동 이미지
  },
]

export default function KoreanCulturalChatbot() {
  const [currentView, setCurrentView] = useState<"location" | "chat">("location")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [userProfile, setUserProfile] = useState({
    language: "ko",
    level: "adult", // expert, adult, children
    interests: ["history", "architecture"],
  })
  const [isListening, setIsListening] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulate location detection
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location detected:", position.coords)
        },
        (error) => {
          console.log("Location access denied:", error)
        },
      )
    }
  }, [])

  const handleLocationSelect = (location: LocationData) => {
    setCurrentLocation(location)
    setCurrentView("chat")

    // Initialize chat with welcome message for selected location
    const welcomeMessage: Message = {
      id: "1",
      type: "ai",
      content: `안녕하세요! ${location.name} AI 가이드입니다. ${location.description}에 대해 자세히 안내해드리겠습니다. 궁금한 것이 있으시면 언제든 물어보세요!`,
      timestamp: new Date(),
      location: location.name,
    }
    setMessages([welcomeMessage])
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response with cultural context
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateContextualResponse(inputMessage),
        timestamp: new Date(),
        location: currentLocation?.name,
        sources: ["국립고궁박물관", "문화재청", "한국관광공사"],
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)

    setInputMessage("")
  }

  const generateContextualResponse = (input: string): string => {
    // Simulate intelligent response based on user profile and location
    const responses = {
      expert:
        "경복궁은 1395년 태조 이성계에 의해 창건된 조선왕조의 법궁입니다. 풍수지리학적으로 백악산을 주산으로 하여 남향으로 배치되었으며...",
      adult: "경복궁은 조선시대 왕이 살던 가장 큰 궁궐이에요. 지금 보시는 근정전은 왕이 신하들과 회의를 하던 곳입니다.",
      children: "와! 여기가 바로 왕님이 살던 집이야! 정말 크고 예쁘지? 저기 큰 건물에서 왕님이 일을 했대요!",
    }

    return responses[userProfile.level as keyof typeof responses] || responses.adult
  }

  const suggestedQuestions = [
    "경복궁은 언제 지어졌고 어떤 의미를 가지나요?",
    "광화문은 경복궁에서 어떤 역할을 했던 곳인가요?",
    "근정전은 조선시대에 어떤 용도로 사용되었나요?",
    "경복궁에서 왕과 왕비는 어디에서 생활했나요?",
    "경복궁에 숨겨진 특별한 건축적 특징은 무엇인가요?",
    "아이들과 함께 경복궁을 즐길 수 있는 방법은요?",
  ]

  const handleVoiceInput = () => {
    setIsListening(!isListening)
    // In a real app, implement speech recognition here
  }

  const handleLanguageChange = (lang: string) => {
    setUserProfile((prev) => ({ ...prev, language: lang }))
  }

  const handleLevelChange = (level: string) => {
    setUserProfile((prev) => ({ ...prev, level }))
  }

  // 지도 표시 (시뮬레이션)
  const MapScreen = () => (
    <div className="flex flex-col h-screen bg-background korean-pattern">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card dancheong-accent">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMap(false)}
            className="p-2 hover:bg-primary/10"
          >
            <MapPin className="w-4 h-4 text-primary" />
          </Button>
          <Avatar className="w-12 h-12 bg-primary shadow-lg">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">지</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-xl text-primary">문화유산 지도</h1>
            <p className="text-sm text-muted-foreground">나레이션이 있는 문화유산 위치</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLanguageChange(userProfile.language === "ko" ? "en" : "ko")}
            className="border-primary/20"
          >
            <Globe className="w-4 h-4" />
            {userProfile.language === "ko" ? "EN" : "한"}
          </Button>
        </div>
      </div>

      {/* Enhanced Map View */}
      <div className="flex-1 relative bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* Enhanced Map Background */}
        <div className="absolute inset-0">
          {/* Base map with roads and landmarks */}
          <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
              <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3"/>
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            
            {/* Grid background */}
            <rect width="100%" height="100%" fill="url(#mapGrid)" />
            
            {/* Major roads */}
            <path d="M 50 300 Q 200 280 350 300 Q 500 320 650 300 Q 750 280 800 290" 
                  stroke="#9ca3af" strokeWidth="12" fill="none" opacity="0.7"/>
            <path d="M 100 250 Q 250 230 400 250 Q 550 270 700 250" 
                  stroke="#9ca3af" strokeWidth="8" fill="none" opacity="0.6"/>
            
            {/* Vertical roads */}
            <path d="M 200 50 L 200 550" stroke="#9ca3af" strokeWidth="6" fill="none" opacity="0.6"/>
            <path d="M 350 70 L 350 530" stroke="#9ca3af" strokeWidth="6" fill="none" opacity="0.6"/>
            <path d="M 500 60 L 500 540" stroke="#9ca3af" strokeWidth="6" fill="none" opacity="0.6"/>
            <path d="M 650 80 L 650 520" stroke="#9ca3af" strokeWidth="6" fill="none" opacity="0.6"/>
            
            {/* Han River */}
            <path d="M 0 380 Q 150 360 300 370 Q 450 380 600 370 Q 750 360 800 375" 
                  stroke="url(#riverGradient)" strokeWidth="20" fill="none"/>
            
            {/* Parks/Green areas */}
            <circle cx="180" cy="180" r="60" fill="#10b981" opacity="0.2"/>
            <circle cx="320" cy="150" r="45" fill="#10b981" opacity="0.2"/>
            <circle cx="480" cy="170" r="50" fill="#10b981" opacity="0.2"/>
            
            {/* City blocks */}
            <rect x="120" y="200" width="40" height="60" fill="#f3f4f6" opacity="0.5"/>
            <rect x="280" y="220" width="50" height="40" fill="#f3f4f6" opacity="0.5"/>
            <rect x="420" y="190" width="45" height="70" fill="#f3f4f6" opacity="0.5"/>
            <rect x="580" y="210" width="60" height="50" fill="#f3f4f6" opacity="0.5"/>
          </svg>
        </div>
        
        {/* Cultural Sites Markers */}
        <div className="absolute inset-0 p-4">
          {culturalSites.map((site, idx) => {
            const positions = [
              { top: '22%', left: '18%' }, // 경복궁
              { top: '18%', left: '32%' }, // 창덕궁
              { top: '42%', left: '20%' }, // 덕수궁
              { top: '15%', left: '45%' }, // 종묘
              { top: '12%', left: '26%' }, // 북촌한옥마을
              { top: '32%', left: '38%' }, // 인사동
            ];
            const position = positions[idx] || { top: '50%', left: '50%' };
            
            return (
              <div
                key={idx}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ top: position.top, left: position.left }}
                onClick={() => handleLocationSelect(site)}
              >
                {/* Enhanced Marker */}
                <div className="relative">
                  {/* Pulse rings */}
                  <div className="absolute inset-0 w-16 h-16 bg-red-500 rounded-full animate-ping opacity-20 -top-2 -left-2"></div>
                  <div className="absolute inset-0 w-12 h-12 bg-red-600 rounded-full animate-pulse opacity-30"></div>
                  
                  {/* Main marker */}
                  <div className="relative w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full border-4 border-white shadow-2xl flex items-center justify-center group-hover:scale-125 transition-all duration-300 z-10">
                    <span className="text-lg font-bold text-white drop-shadow-lg">{site.illustration}</span>
                  </div>
                  
                  {/* Enhanced Info Card */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 p-4 w-56 text-center">
                      <div className="text-lg font-bold text-gray-800 mb-2">{site.name}</div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{site.description}</p>
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <Badge variant="secondary" className="text-xs bg-red-50 text-red-700 border-red-200">
                          <Volume2 className="w-3 h-3 mr-1" />
                          나레이션
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span className="font-medium">{site.distance}km</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLocationSelect(site)
                        }}
                      >
                        {site.buttonText}
                      </Button>
                    </div>
                    {/* Enhanced Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-white/95 filter drop-shadow-lg"></div>
                  </div>
                  
                  {/* Location label */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-lg text-xs font-semibold text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {site.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Enhanced Legend */}
        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-gray-200 max-w-xs">
          <h3 className="font-bold text-sm text-gray-800 mb-3 flex items-center gap-2">
            <Map className="w-4 h-4 text-red-600" />
            서울 문화유산 지도
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-sm"></div>
              <span>AI 나레이션 문화유산</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-3 h-0.5 bg-gray-400"></div>
              <span>주요 도로</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-3 h-1 bg-blue-400 rounded"></div>
              <span>한강</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
            마커를 클릭하면 상세 정보를 확인할 수 있습니다
          </div>
        </div>
        
        {/* Enhanced Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-3">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 w-12 h-12"
            onClick={() => console.log('Zoom in')}
          >
            <span className="text-xl font-bold text-gray-700">+</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 w-12 h-12"
            onClick={() => console.log('Zoom out')}
          >
            <span className="text-xl font-bold text-gray-700">−</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 w-12 h-12"
            title="전체 보기"
          >
            <Navigation className="w-5 h-5 text-gray-700" />
          </Button>
        </div>
        
        {/* Compass */}
        <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-200">
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="text-lg font-bold text-red-600">N</span>
          </div>
        </div>
      </div>
    </div>
  )

  const LocationSelectionScreen = () => (
    <div className="flex flex-col h-screen bg-background korean-pattern">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card dancheong-accent">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 bg-primary shadow-lg">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">한</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-xl text-primary">한국문화 AI 가이드</h1>
            <p className="text-sm text-muted-foreground">전통과 현대가 만나는 문화 여행</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowMap(!showMap)} className="border-primary/20">
            <Map className="w-4 h-4" />
            지도
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLanguageChange(userProfile.language === "ko" ? "en" : "ko")}
            className="border-primary/20"
          >
            <Globe className="w-4 h-4" />
            {userProfile.language === "ko" ? "EN" : "한"}
          </Button>
        </div>
      </div>

      {/* Location Cards - Horizontal Scroll */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4 pb-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Navigation className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-primary">주변 문화유적지</h2>
              <p className="text-sm text-muted-foreground">좌우로 스크롤하여 원하는 장소를 선택해보세요</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto px-4 pb-4 scrollbar-hide">
          <div className="flex gap-4 w-max">
            {culturalSites.map((site, idx) => (
              <Card
                key={idx}
                className={`relative overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/30 w-80 flex-shrink-0 group`}
                onClick={() => handleLocationSelect(site)}
                style={{
                  backgroundImage: site.backgroundImage ? `url(${site.backgroundImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* 배경 이미지 오버레이 */}
                <div className={`absolute inset-0 ${site.backgroundImage ? 'bg-black/40' : site.color || 'bg-gradient-to-br from-gray-100 to-gray-200'} transition-all duration-300 group-hover:bg-black/50`}></div>
                
                <div className="relative p-6 h-full text-white z-10">
                  {/* Top Section with Icon and Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl mb-2 drop-shadow-2xl filter">{site.illustration}</div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800 shadow-lg backdrop-blur-sm">
                        <Volume2 className="w-3 h-3 mr-1" />
                        AI 나레이션
                      </Badge>
                      <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1 backdrop-blur-sm">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium text-gray-800">4.8</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="font-bold text-2xl mb-3 drop-shadow-lg filter">{site.name}</h3>
                    <p className="text-sm leading-relaxed mb-4 line-clamp-3 text-white/90 drop-shadow-sm">{site.description}</p>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-white/80">
                        <MapPin className="w-3 h-3" />
                        <span className="font-medium">{site.distance}km</span>
                      </div>
                      <Badge variant="outline" className="border-white/50 text-white/90 bg-white/10 backdrop-blur-sm">
                        {site.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    <Button
                      className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-4 rounded-xl shadow-lg transition-all duration-200 text-base backdrop-blur-sm border border-white/30 hover:border-white/50"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLocationSelect(site)
                      }}
                    >
                      {site.buttonText || "지금 둘러볼게요"}
                    </Button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-10"></div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="px-4 pb-4">
          <div className="p-4 bg-card/60 backdrop-blur-sm rounded-lg border border-primary/10">
            <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              빠른 접근
            </h3>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg py-3"
              onClick={() => handleLocationSelect(culturalSites[0])}
            >
              현재 위치에서 가장 가까운 문화유산 탐방하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const ChatScreen = () => (
    <div className="flex flex-col h-screen bg-background korean-pattern">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card dancheong-accent">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("location")}
            className="p-2 hover:bg-primary/10"
          >
            <MapPin className="w-4 h-4 text-primary" />
          </Button>
          <Avatar className="w-12 h-12 bg-primary shadow-lg">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">궁</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-lg text-primary">{currentLocation?.name} AI 문화해설</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{currentLocation?.name} 전통문화 가이드</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLanguageChange(userProfile.language === "ko" ? "en" : "ko")}
            className="border-primary/20"
          >
            <Globe className="w-4 h-4" />
            {userProfile.language === "ko" ? "EN" : "한"}
          </Button>
        </div>
      </div>

      {/* User Profile Controls */}
      <div className="p-3 bg-muted/30 border-b cloud-pattern">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">설명 수준</span>
        </div>
        <div className="flex gap-2">
          {[
            { key: "expert", label: "전문가", icon: "🎓" },
            { key: "adult", label: "성인", icon: "👤" },
            { key: "children", label: "어린이", icon: "🧒" },
          ].map((level) => (
            <Button
              key={level.key}
              variant={userProfile.level === level.key ? "default" : "outline"}
              size="sm"
              onClick={() => handleLevelChange(level.key)}
              className={`text-xs ${
                userProfile.level === level.key
                  ? "bg-primary text-primary-foreground"
                  : "border-primary/20 hover:border-primary/40"
              }`}
            >
              {level.icon} {level.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
              {message.type === "ai" && (
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-7 h-7 bg-primary shadow-md">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">AI</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-primary">전통문화 AI 해설사</span>
                  {message.location && (
                    <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {message.location}
                    </Badge>
                  )}
                </div>
              )}

              <Card
                className={`p-4 shadow-md ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground ml-auto border-primary"
                    : "bg-card/90 backdrop-blur-sm border-primary/10"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>

                {message.sources && (
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <span className="font-medium">참고 자료:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {message.sources.map((source, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-primary/20 text-primary">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {message.type === "ai" && (
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-primary/10">
                    <Volume2 className="w-3 h-3 text-primary" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="p-4 border-t bg-muted/20 cloud-pattern">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">추천 질문</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {suggestedQuestions.slice(0, 3).map((question, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs border-primary/20 hover:border-primary/40 hover:bg-primary/5 bg-transparent"
              onClick={() => setInputMessage(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-card/80 backdrop-blur-sm dancheong-accent">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`${currentLocation?.name}의 전통과 역사에 대해 궁금한 것을 물어보세요...`}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="pr-12 border-primary/20 focus:border-primary/40 bg-background/90"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-primary/10"
              onClick={handleVoiceInput}
            >
              <Mic className={`w-4 h-4 ${isListening ? "text-destructive" : "text-primary"}`} />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  if (showMap) {
    return <MapScreen />
  }
  
  return currentView === "location" ? <LocationSelectionScreen /> : <ChatScreen />
}
