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
    name: {
      ko: "경복궁",
      ja: "景福宮",
      en: "Gyeongbokgung Palace",
      zh: "景福宫",
      es: "Palacio Gyeongbok",
      fr: "Palais Gyeongbok"
    },
    description: {
      ko: "조선왕조의 정궁으로 웅장한 근정전과 경회루가 있는 대표적인 궁궐",
      ja: "朝鮮王朝の正宮で、雄壮な勤政殿と慶会楼がある代表的な宮殿",
      en: "The main royal palace of the Joseon Dynasty, featuring the magnificent Geunjeongjeon Hall and Gyeonghoeru Pavilion",
      zh: "朝鲜王朝的正宫，拥有雄伟的勤政殿和庆会楼的代表性宫殿",
      es: "Palacio real principal de la dinastía Joseon, con el magnífico Geunjeongjeon Hall y el Pabellón Gyeonghoeru",
      fr: "Palais royal principal de la dynastie Joseon, avec le magnifique hall Geunjeongjeon et le pavillon Gyeonghoeru"
    },
    coordinates: { lat: 37.578617, lng: 126.977041 },
    distance: 0.1,
    hasNarration: true,
    category: {
      ko: "궁궐",
      ja: "宮殿",
      en: "Palace",
      zh: "宫殿",
      es: "Palacio",
      fr: "Palais"
    },
    color: "bg-gradient-to-br from-red-100 to-red-200",
    buttonText: {
      ko: "지금 둘러볼게요",
      ja: "今見学します",
      en: "Explore Now",
      zh: "现在参观",
      es: "Explorar Ahora",
      fr: "Explorer Maintenant"
    },
    backgroundImage: "https://www.kh.or.kr/jnrepo/namo/img/images/000045/20230405103334542_MPZHA77B.jpg",
    detailPlaces: [
      {
        id: "geunjeongjeon",
        name: {
          ko: "근정전",
          ja: "勤政殿",
          en: "Geunjeongjeon Hall",
          zh: "勤政殿",
          es: "Salón Geunjeongjeon",
          fr: "Salle Geunjeongjeon"
        },
        description: {
          ko: "조선왕조 정전으로 왕이 신하들과 회의하던 곳",
          ja: "朝鮮王朝の正殿で、王が臣下と会議を行った場所",
          en: "The main throne hall of the Joseon Dynasty where the king held court with his ministers",
          zh: "朝鲜王朝的正殿，国王与大臣们举行会议的地方",
          es: "El salón del trono principal de la dinastía Joseon donde el rey celebraba audiencias con sus ministros",
          fr: "La salle du trône principale de la dynastie Joseon où le roi tenait audience avec ses ministres"
        },
        category: {
          ko: "정전",
          ja: "正殿",
          en: "Main Hall",
          zh: "正殿",
          es: "Salón Principal",
          fr: "Salle Principale"
        },
        image: "https://www.kh.or.kr/jnrepo/namo/img/images/000045/20230405103334542_MPZHA77B.jpg",
        narrationDuration: "3분 20초",
        highlights: [
          {
            ko: "웅장한 왕좌",
            ja: "雄壮な王座",
            en: "Magnificent throne",
            zh: "雄伟的王座",
            es: "Trono magnífico",
            fr: "Trône magnifique"
          },
          {
            ko: "단청 장식",
            ja: "丹青装飾",
            en: "Dancheong decoration",
            zh: "丹青装饰",
            es: "Decoración Dancheong",
            fr: "Décoration Dancheong"
          },
          {
            ko: "월대와 난간",
            ja: "月台と欄干",
            en: "Stone platform and railings",
            zh: "月台和栏杆",
            es: "Plataforma de piedra y barandillas",
            fr: "Plateforme de pierre et balustrades"
          }
        ]
      },
      {
        id: "gyeonghoeru",
        name: {
          ko: "경회루",
          ja: "慶会楼",
          en: "Gyeonghoeru Pavilion",
          zh: "庆会楼",
          es: "Pabellón Gyeonghoeru",
          fr: "Pavillon Gyeonghoeru"
        },
        description: {
          ko: "조선시대 연회와 외교 행사가 열린 누각",
          ja: "朝鮮時代に宴会や外交行事が行われた楼閣",
          en: "A pavilion where banquets and diplomatic events were held during the Joseon Dynasty",
          zh: "朝鲜时代举行宴会和外交活动的楼阁",
          es: "Un pabellón donde se celebraban banquetes y eventos diplomáticos durante la dinastía Joseon",
          fr: "Un pavillon où se tenaient banquets et événements diplomatiques pendant la dynastie Joseon"
        },
        category: {
          ko: "누각",
          ja: "楼閣",
          en: "Pavilion",
          zh: "楼阁",
          es: "Pabellón",
          fr: "Pavillon"
        },
        image: "https://www.kh.or.kr/jnrepo/namo/img/images/000045/20230405103334542_MPZHA77B.jpg",
        narrationDuration: "2분 45초",
        highlights: [
          {
            ko: "연못 위 누각",
            ja: "池の上の楼閣",
            en: "Pavilion over pond",
            zh: "池上楼阁",
            es: "Pabellón sobre estanque",
            fr: "Pavillon sur étang"
          },
          {
            ko: "아름다운 야경",
            ja: "美しい夜景",
            en: "Beautiful night view",
            zh: "美丽的夜景",
            es: "Hermosa vista nocturna",
            fr: "Belle vue nocturne"
          },
          {
            ko: "외교 무대",
            ja: "外交の舞台",
            en: "Diplomatic stage",
            zh: "外交舞台",
            es: "Escenario diplomático",
            fr: "Scène diplomatique"
          }
        ]
      }
    ]
  },
  {
    name: {
      ko: "창덕궁",
      ja: "昌徳宮",
      en: "Changdeokgung Palace",
      zh: "昌德宫",
      es: "Palacio Changdeok",
      fr: "Palais Changdeok"
    },
    description: {
      ko: "자연과 조화를 이룬 아름다운 후원이 있는 유네스코 세계문화유산",
      ja: "自然と調和した美しい後苑があるユネスコ世界文化遺産",
      en: "UNESCO World Heritage Site with beautiful gardens in harmony with nature",
      zh: "拥有与自然和谐统一的美丽后苑的联合国教科文组织世界文化遗产",
      es: "Patrimonio Mundial de la UNESCO con hermosos jardines en armonía con la naturaleza",
      fr: "Site du patrimoine mondial de l'UNESCO avec de beaux jardins en harmonie avec la nature"
    },
    coordinates: { lat: 37.579617, lng: 126.991169 },
    distance: 0.3,
    hasNarration: true,
    category: {
      ko: "궁궐",
      ja: "宮殿",
      en: "Palace",
      zh: "宫殿",
      es: "Palacio",
      fr: "Palais"
    },
    color: "bg-gradient-to-br from-green-100 to-green-200",
    buttonText: {
      ko: "지금 둘러볼게요",
      ja: "今見学します",
      en: "Explore Now",
      zh: "现在参观",
      es: "Explorar Ahora",
      fr: "Explorer Maintenant"
    },
    backgroundImage: "https://www.kh.or.kr/jnrepo/namo/img/images/000045/20230405103510470_DHF3M55S.jpg",
  },
  {
    name: {
      ko: "덕수궁",
      ja: "徳寿宮",
      en: "Deoksugung Palace",
      zh: "德寿宫",
      es: "Palacio Deoksu",
      fr: "Palais Deoksu"
    },
    description: {
      ko: "서양식과 한국 전통이 어우러진 독특한 건축양식의 근대 궁궐",
      ja: "西洋式と韓国の伝統が調和した独特な建築様式の近代宮殿",
      en: "Modern palace with unique architecture blending Western and Korean traditional styles",
      zh: "融合西式和韩国传统风格的独特建筑样式的近代宫殿",
      es: "Palacio moderno con arquitectura única que combina estilos occidentales y tradicionales coreanos",
      fr: "Palais moderne avec une architecture unique mêlant styles occidentaux et traditionnels coréens"
    },
    coordinates: { lat: 37.565834, lng: 126.975068 },
    distance: 0.5,
    hasNarration: true,
    category: {
      ko: "궁궐",
      ja: "宮殿",
      en: "Palace",
      zh: "宫殿",
      es: "Palacio",
      fr: "Palais"
    },
    color: "bg-gradient-to-br from-blue-100 to-blue-200",
    buttonText: {
      ko: "지금 둘러볼게요",
      ja: "今見学します",
      en: "Explore Now",
      zh: "现在参观",
      es: "Explorar Ahora",
      fr: "Explorer Maintenant"
    },
    backgroundImage: "https://www.kh.or.kr/jnrepo/namo/img/images/000046/20230414194548940_NU0YGS17.jpg",
  },
  {
    name: {
      ko: "종묘",
      ja: "宗廟",
      en: "Jongmyo Shrine",
      zh: "宗庙",
      es: "Santuario Jongmyo",
      fr: "Sanctuaire Jongmyo"
    },
    description: {
      ko: "조선왕조 역대 왕과 왕비의 신위를 모신 엄숙하고 신성한 사당",
      ja: "朝鮮王朝歴代の王と王妃の神位を祀った厳粛で神聖な祠堂",
      en: "Sacred and solemn shrine dedicated to the tablets of Joseon Dynasty kings and queens",
      zh: "供奉朝鲜王朝历代国王和王妃神位的庄严神圣的祠堂",
      es: "Santuario sagrado y solemne dedicado a las tablillas de los reyes y reinas de la dinastía Joseon",
      fr: "Sanctuaire sacré et solennel dédié aux tablettes des rois et reines de la dynastie Joseon"
    },
    coordinates: { lat: 37.574147, lng: 126.993229 },
    distance: 0.4,
    hasNarration: true,
    category: {
      ko: "사당",
      ja: "祠堂",
      en: "Shrine",
      zh: "祠堂",
      es: "Santuario",
      fr: "Sanctuaire"
    },
    color: "bg-gradient-to-br from-purple-100 to-purple-200",
    buttonText: {
      ko: "지금 둘러볼게요",
      ja: "今見学します",
      en: "Explore Now",
      zh: "现在参观",
      es: "Explorar Ahora",
      fr: "Explorer Maintenant"
    },
    backgroundImage: "https://royal.khs.go.kr/resource/templete/royal/img/sub/intro/img_intro_jongmyo.png",
  },
  {
    name: {
      ko: "북촌한옥마을",
      ja: "北村韓屋村",
      en: "Bukchon Hanok Village",
      zh: "北村韩屋村",
      es: "Pueblo Hanok de Bukchon",
      fr: "Village Hanok de Bukchon"
    },
    description: {
      ko: "600년 역사의 전통 한옥들이 그대로 보존된 살아있는 문화유산",
      ja: "600年の歴史を持つ伝統的な韓屋がそのまま保存された生きている文化遺産",
      en: "Living cultural heritage with traditional hanoks preserved from 600 years of history",
      zh: "保存着600年历史传统韩屋的活生生的文化遗产",
      es: "Patrimonio cultural vivo con hanoks tradicionales conservados de 600 años de historia",
      fr: "Patrimoine culturel vivant avec des hanoks traditionnels préservés de 600 ans d'histoire"
    },
    coordinates: { lat: 37.582075, lng: 126.983559 },
    distance: 0.2,
    hasNarration: true,
    category: {
      ko: "마을",
      ja: "村",
      en: "Village",
      zh: "村落",
      es: "Pueblo",
      fr: "Village"
    },
    color: "bg-gradient-to-br from-yellow-100 to-orange-200",
    buttonText: {
      ko: "지금 둘러볼게요",
      ja: "今見学します",
      en: "Explore Now",
      zh: "现在参观",
      es: "Explorar Ahora",
      fr: "Explorer Maintenant"
    },
    backgroundImage: "https://korean.visitseoul.net/data/kukudocs/seoul2133/20220518/202205181617250471.jpg",
  },
  {
    name: {
      ko: "인사동",
      ja: "仁寺洞",
      en: "Insadong",
      zh: "仁寺洞",
      es: "Insadong",
      fr: "Insadong"
    },
    description: {
      ko: "전통문화와 현대 예술이 만나는 특별한 문화예술의 거리",
      ja: "伝統文化と現代アートが出会う特別な文化芸術の街",
      en: "Special cultural and artistic street where traditional culture meets modern art",
      zh: "传统文化与现代艺术相遇的特殊文化艺术街区",
      es: "Calle cultural y artística especial donde la cultura tradicional se encuentra con el arte moderno",
      fr: "Rue culturelle et artistique spéciale où la culture traditionnelle rencontre l'art moderne"
    },
    coordinates: { lat: 37.571607, lng: 126.985641 },
    distance: 0.6,
    hasNarration: true,
    category: {
      ko: "문화거리",
      ja: "文化街",
      en: "Cultural Street",
      zh: "文化街",
      es: "Calle Cultural",
      fr: "Rue Culturelle"
    },
    color: "bg-gradient-to-br from-teal-100 to-cyan-200",
    buttonText: {
      ko: "지금 둘러볼게요",
      ja: "今見学します",
      en: "Explore Now",
      zh: "现在参观",
      es: "Explorar Ahora",
      fr: "Explorer Maintenant"
    },
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