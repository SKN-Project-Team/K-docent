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
}
