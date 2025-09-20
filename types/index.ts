export interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  location?: string
  sources?: string[]
}

export interface MultilingualText {
  ko: string
  ja: string
  en: string
  zh: string
  es: string
  fr: string
}

export interface LocationData {
  siteId?: number
  name: MultilingualText
  description: MultilingualText
  coordinates: { lat: number; lng: number }
  distance?: number
  hasNarration: boolean
  category: MultilingualText
  color?: string
  illustration?: string
  buttonText?: MultilingualText
  backgroundImage?: string
  detailPlaces?: DetailPlace[]
}

export interface DetailPlace {
  id: string
  name: MultilingualText
  description: MultilingualText
  category: MultilingualText
  image?: string
  narrationDuration?: string
  highlights: MultilingualText[]
}

// 축제/행사 정보 타입
export interface FestivalData {
  id: string
  title: string
  description: string
  startDate: string // YYYYMMDD 형식
  endDate: string   // YYYYMMDD 형식
  address: string
  phone?: string
  image?: string
  thumbnailImage?: string
  lat?: number
  lng?: number
  category: string
  areaCode?: string
  distance?: number // 미터
  isOngoing: boolean
  daysUntilStart?: number
  daysUntilEnd?: number
}

// 축제 API 응답 타입
export interface FestivalApiResponse {
  festivals: FestivalData[]
  summary: {
    total: number
    ongoing: number
    upcoming: number
    searchRadius: number
    searchCenter: { lat: number; lng: number } | null
  }
}
