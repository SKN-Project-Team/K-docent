export interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  location?: string
  sources?: string[]
}

export interface LocationData {
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
  detailPlaces?: DetailPlace[]
}

export interface DetailPlace {
  id: string
  name: string
  description: string
  category: string
  image?: string
  narrationDuration?: string
  highlights: string[]
}