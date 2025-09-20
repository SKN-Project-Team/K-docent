// FastAPI 백엔드 API 타입 정의

export interface ApiResponse<T> {
  data: T
  message?: string
  status: 'success' | 'error'
}

export interface ApiError {
  detail: string
  status_code: number
  timestamp: string
}

// 채팅 관련 타입
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface ChatRequest {
  message: string
  language?: string
  location?: string
  history?: ChatMessage[]
}

export interface ChatResponse {
  response: string
  sources?: string[]
  conversation_id?: string
}

// 위치 관련 타입
export interface Location {
  lat: number
  lng: number
  address?: string
}

export interface POI {
  id: string
  name: string
  description?: string
  location: Location
  category: string
  images?: string[]
  rating?: number
}

export interface NearbyPOIRequest {
  lat: number
  lng: number
  radius?: number
  category?: string
  limit?: number
}

// 축제/이벤트 관련 타입
export interface Festival {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: Location
  category: string
  images?: string[]
  organizer?: string
  contact?: string
}

export interface FestivalRequest {
  region?: string
  category?: string
  startDate?: string
  endDate?: string
  limit?: number
}

// 사용자 관련 타입
export interface User {
  id: string
  email?: string
  name?: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  language: string
  interests: string[]
  notification_enabled: boolean
}

// 관광지 상세 정보 타입
export interface TouristSpot {
  id: string
  name: string
  description: string
  location: Location
  category: string
  images: string[]
  opening_hours?: string
  contact?: string
  website?: string
  rating?: number
  reviews?: Review[]
  nearby_pois?: POI[]
}

export interface Review {
  id: string
  user_name: string
  rating: number
  comment: string
  created_at: string
}

// 문화재 콘텐츠 관련 타입 (Simple API용)
export interface SimpleHeritageContent {
  content_id: number
  site_id: number
  language: string
  name: string
  description_summary: string
  latitude: number
  longitude: number
  distance_km: number
  image_url?: string
  has_tts_audio: boolean
}

export interface NearbyHeritageRequest {
  latitude: number
  longitude: number
  language: string // 필수 파라미터로 변경
  radius_km?: number
  category?: string
  limit?: number
}

export interface NearbyHeritageResponse {
  results: SimpleHeritageContent[]
  total_count: number
  search_center: {
    latitude: number
    longitude: number
  }
  search_radius_km: number
}

// 기존 상세 타입들 (필요한 경우를 위해 유지)
export interface HeritageContent {
  content_id: number
  site_id: number
  language: string
  name: string
  description_summary: string
  description_full: string
  narration_text_adult: string
  narration_text_child: string
  narration_status: string
  narration_generation_status: string
  created_at: string
  updated_at: string
}

export interface TourismSite {
  site_id: number
  category: string
  latitude: number
  longitude: number
  region: string
  address: string
  status: string
  has_narration: boolean
  created_at: string
}

export interface TTSAudioUrl {
  audio_id: number
  target_age_group: 'adult' | 'child'
  language: string
  public_url: string
  duration_seconds: number
  generation_status: string
}

export interface HeritageContentNearby {
  heritage_content: HeritageContent
  tourism_site: TourismSite
  distance_km: number
  tts_audio_urls: TTSAudioUrl[]
}

// 검색 관련 타입
export interface SearchRequest {
  query: string
  category?: string
  location?: Location
  radius?: number
  limit?: number
}

export interface SearchResult {
  results: (POI | Festival | TouristSpot)[]
  total: number
  page: number
  per_page: number
}