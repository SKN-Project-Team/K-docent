// API 클라이언트 메인 엔트리 포인트

// 타입 export
export type {
  ApiResponse,
  ApiError,
  ChatRequest,
  ChatResponse,
  Location,
  POI,
  NearbyPOIRequest,
  Festival,
  FestivalRequest,
  TouristSpot,
  SearchRequest,
  SearchResult,
  User,
  UserPreferences,
  Review,
  SimpleHeritageContent,
  HeritageContent,
  TourismSite,
  TTSAudioUrl,
  HeritageContentNearby,
  NearbyHeritageRequest,
  NearbyHeritageResponse,
} from './types'

// 클라이언트 export
export { default as apiClient } from './client'
export { chatAPI, heritageAPI, poiAPI, festivalAPI, searchAPI, userAPI } from './client'

// 유틸리티 export
export {
  ApiClientError,
  handleApiResponse,
  retryApiCall,
  getApiConfig,
  logApiCall,
  debounce,
  calculateDistance,
  validateLocation,
  validateEmail,
  apiCache,
  buildURL,
} from './utils'

// 편의 함수들
export * from './hooks'
