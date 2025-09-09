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