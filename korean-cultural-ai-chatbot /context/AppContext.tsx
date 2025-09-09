"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { LocationData, Message } from "@/types"

interface AppContextType {
  // 현재 선택된 문화재
  currentLocation: LocationData | null
  setCurrentLocation: (location: LocationData | null) => void
  
  // 채팅 메시지
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  
  // 입력 메시지
  inputMessage: string
  setInputMessage: (message: string) => void
  
  // 나레이션 재생 상태
  isPlaying: string | null
  setIsPlaying: (id: string | null) => void
  
  // 사용자 프로필
  userProfile: {
    language: string
    level: string
    interests: string[]
  }
  setUserProfile: React.Dispatch<React.SetStateAction<{
    language: string
    level: string
    interests: string[]
  }>>
  
  // 음성 입력 상태
  isListening: boolean
  setIsListening: (listening: boolean) => void
  
  // 문화재 데이터
  culturalSites: LocationData[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
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
    buttonText: "지금 둘러볼게요",
    backgroundImage: "https://www.kh.or.kr/jnrepo/namo/img/images/000045/20230405103334542_MPZHA77B.jpg",
    detailPlaces: [
      {
        id: "geunjeongjeon",
        name: "근정전",
        description: "조선왕조 정전으로 왕이 신하들과 회의하던 곳",
        category: "정전",
        image: "https://www.kh.or.kr/jnrepo/namo/img/images/000045/20230405103334542_MPZHA77B.jpg",
        narrationDuration: "3분 20초",
        highlights: ["웅장한 왕좌", "단청 장식", "월대와 난간"]
      },
      {
        id: "gyeonghoeru",
        name: "경회루",
        description: "조선시대 연회와 외교 행사가 열린 누각",
        category: "누각",
        image: "https://www.kh.or.kr/jnrepo/namo/img/images/000045/20230405103334542_MPZHA77B.jpg",
        narrationDuration: "2분 45초",
        highlights: ["연못 위 누각", "아름다운 야경", "외교 무대"]
      },
      {
        id: "gwanghwamun",
        name: "광화문",
        description: "경복궁의 정문이자 조선왕조의 상징",
        category: "문",
        image: "https://www.kh.or.kr/jnrepo/namo/img/images/000045/20230405103334542_MPZHA77B.jpg",
        narrationDuration: "2분 10초",
        highlights: ["위풍당당한 정문", "수문장 교대식", "역사적 상징성"]
      },
      {
        id: "sajeongjeon",
        name: "사정전",
        description: "왕이 일상 업무를 보던 편전",
        category: "편전",
        image: "https://www.kh.or.kr/jnrepo/namo/img/images/000045/20230405103334542_MPZHA77B.jpg",
        narrationDuration: "2분 30초",
        highlights: ["왕의 집무실", "조선 정치의 중심", "아름다운 건축미"]
      },
      {
        id: "gangnyeongjeon",
        name: "강녕전",
        description: "왕의 침전으로 사용된 건물",
        category: "침전",
        image: "https://www.kh.or.kr/jnrepo/namo/img/images/000045/20230405103334542_MPZHA77B.jpg",
        narrationDuration: "2분 15초",
        highlights: ["왕의 사적 공간", "온돌 시설", "전통 건축양식"]
      }
    ]
  },
  {
    name: "창덕궁",
    description: "자연과 조화를 이룬 아름다운 후원이 있는 유네스코 세계문화유산",
    coordinates: { lat: 37.579617, lng: 126.991169 },
    distance: 0.3,
    hasNarration: true,
    category: "궁궐",
    color: "bg-gradient-to-br from-green-100 to-green-200",
    buttonText: "지금 둘러볼게요",
    backgroundImage: "https://www.kh.or.kr/jnrepo/namo/img/images/000045/20230405103510470_DHF3M55S.jpg",
  },
  {
    name: "덕수궁",
    description: "서양식과 한국 전통이 어우러진 독특한 건축양식의 근대 궁궐",
    coordinates: { lat: 37.565834, lng: 126.975068 },
    distance: 0.5,
    hasNarration: true,
    category: "궁궐",
    color: "bg-gradient-to-br from-blue-100 to-blue-200",
    buttonText: "지금 둘러볼게요",
    backgroundImage: "https://www.kh.or.kr/jnrepo/namo/img/images/000046/20230414194548940_NU0YGS17.jpg",
  },
  {
    name: "종묘",
    description: "조선왕조 역대 왕과 왕비의 신위를 모신 엄숙하고 신성한 사당",
    coordinates: { lat: 37.574147, lng: 126.993229 },
    distance: 0.4,
    hasNarration: true,
    category: "사당",
    color: "bg-gradient-to-br from-purple-100 to-purple-200",
    buttonText: "지금 둘러볼게요",
    backgroundImage: "https://royal.khs.go.kr/resource/templete/royal/img/sub/intro/img_intro_jongmyo.png",
  },
  {
    name: "북촌한옥마을",
    description: "600년 역사의 전통 한옥들이 그대로 보존된 살아있는 문화유산",
    coordinates: { lat: 37.582075, lng: 126.983559 },
    distance: 0.2,
    hasNarration: true,
    category: "마을",
    color: "bg-gradient-to-br from-yellow-100 to-orange-200",
    buttonText: "지금 둘러볼게요",
    backgroundImage: "https://korean.visitseoul.net/data/kukudocs/seoul2133/20220518/202205181617250471.jpg",
  },
  {
    name: "인사동",
    description: "전통문화와 현대 예술이 만나는 특별한 문화예술의 거리",
    coordinates: { lat: 37.571607, lng: 126.985641 },
    distance: 0.6,
    hasNarration: true,
    category: "문화거리",
    color: "bg-gradient-to-br from-teal-100 to-cyan-200",
    buttonText: "지금 둘러볼게요",
    backgroundImage: "https://korean.visitseoul.net/media/img/%EC%A2%85%EB%A1%9C_%EC%9D%B8%EC%82%AC%EB%8F%99%EA%B1%B0%EB%A6%AC?srvcId=MEDIA&parentSn=942&fileTy=MEDIA&fileNo=1",
  },
]

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState({
    language: "ko",
    level: "adult", // expert, adult, children
    interests: ["history", "architecture"],
  })
  const [isListening, setIsListening] = useState(false)

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

  const value: AppContextType = {
    currentLocation,
    setCurrentLocation,
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isPlaying,
    setIsPlaying,
    userProfile,
    setUserProfile,
    isListening,
    setIsListening,
    culturalSites
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}