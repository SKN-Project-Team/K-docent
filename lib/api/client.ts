import {
  ApiResponse,
  ApiError,
  ChatRequest,
  ChatResponse,
  NearbyPOIRequest,
  POI,
  FestivalRequest,
  Festival,
  TouristSpot,
  SearchRequest,
  SearchResult,
  User,
  UserPreferences,
  NearbyHeritageRequest,
  NearbyHeritageResponse,
  NarrationGenerateRequest,
  NarrationGenerateResponse,
  TTSUrlRequest,
  TTSUrlResponse,
  CreateHeritageRequest,
  CreateHeritageResponse,
  BulkCreateHeritageRequest,
  BulkCreateHeritageResponse
} from './types'

// API 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
const API_TIMEOUT = 30000 // 30초

class ApiClient {
  private baseURL: string
  private timeout: number

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL.replace(/\/$/, '') // trailing slash 제거
    this.timeout = timeout
  }

  // 기본 fetch 래퍼
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
          status_code: response.status,
          timestamp: new Date().toISOString(),
        }))
        throw new Error(JSON.stringify(errorData))
      }

      const data = await response.json()
      return {
        data,
        status: 'success'
      }
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(JSON.stringify({
            detail: 'Request timeout',
            status_code: 408,
            timestamp: new Date().toISOString(),
          }))
        }

        // JSON 파싱된 에러인지 확인
        try {
          JSON.parse(error.message)
          throw error
        } catch {
          // 일반 에러인 경우
          throw new Error(JSON.stringify({
            detail: error.message,
            status_code: 500,
            timestamp: new Date().toISOString(),
          }))
        }
      }

      throw error
    }
  }

  // GET 요청
  private async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }

    const queryString = searchParams.toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint

    return this.request<T>(url, { method: 'GET' })
  }

  // POST 요청
  private async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT 요청
  private async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE 요청
  private async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // ========== 채팅 API ==========
  async sendChatMessage(request: ChatRequest): Promise<ApiResponse<ChatResponse>> {
    return this.post<ChatResponse>('/chat', request)
  }

  // 스트리밍 채팅 (Server-Sent Events)
  async streamChatMessage(
    request: ChatRequest,
    onMessage: (chunk: string) => void,
    onError: (error: string) => void = console.error,
    onComplete: () => void = () => {}
  ): Promise<void> {
    const url = `${this.baseURL}/chat/stream`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Response body is not readable')
      }

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          onComplete()
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        onMessage(chunk)
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : String(error))
    }
  }

  // ========== 문화재 콘텐츠 API ==========
  async getNearbyHeritage(request: NearbyHeritageRequest): Promise<ApiResponse<NearbyHeritageResponse>> {
    return this.get<NearbyHeritageResponse>('/api/v1/heritage-contents/nearby/simple', request)
  }

  // ========== TTS URL API ==========
  async getTTSUrl(request: TTSUrlRequest): Promise<ApiResponse<TTSUrlResponse>> {
    return this.get<TTSUrlResponse>('/api/v1/tts/url', request)
  }

  // ========== 나레이션 생성 API ==========
  async generateNarration(request: NarrationGenerateRequest): Promise<ApiResponse<NarrationGenerateResponse>> {
    const params = new URLSearchParams()
    Object.entries(request).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    })

    const url = `/api/v1/tts/generate-and-save?${params.toString()}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 1분 타임아웃

    try {
      const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }

      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'POST',
        headers: defaultHeaders,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
          status_code: response.status,
          timestamp: new Date().toISOString(),
        }))
        throw new Error(JSON.stringify(errorData))
      }

      const data = await response.json()
      return {
        data,
        status: 'success'
      }
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(JSON.stringify({
            detail: 'Request timeout (1 minute)',
            status_code: 408,
            timestamp: new Date().toISOString(),
          }))
        }

        // JSON 파싱된 에러인지 확인
        try {
          JSON.parse(error.message)
          throw error
        } catch {
          // 일반 에러인 경우
          throw new Error(JSON.stringify({
            detail: error.message,
            status_code: 500,
            timestamp: new Date().toISOString(),
          }))
        }
      }

      throw error
    }
  }

  // ========== POI API ==========
  async getNearbyPOIs(request: NearbyPOIRequest): Promise<ApiResponse<POI[]>> {
    return this.get<POI[]>('/pois/nearby', request)
  }

  async getPOIById(id: string): Promise<ApiResponse<TouristSpot>> {
    return this.get<TouristSpot>(`/pois/${id}`)
  }

  // ========== 축제 API ==========
  async getFestivals(request?: FestivalRequest): Promise<ApiResponse<Festival[]>> {
    return this.get<Festival[]>('/festivals', request)
  }

  async getFestivalById(id: string): Promise<ApiResponse<Festival>> {
    return this.get<Festival>(`/festivals/${id}`)
  }

  // ========== 검색 API ==========
  async search(request: SearchRequest): Promise<ApiResponse<SearchResult>> {
    return this.post<SearchResult>('/search', request)
  }

  // ========== 사용자 API ==========
  async getUser(userId: string): Promise<ApiResponse<User>> {
    return this.get<User>(`/users/${userId}`)
  }

  async updateUserPreferences(userId: string, preferences: UserPreferences): Promise<ApiResponse<User>> {
    return this.put<User>(`/users/${userId}/preferences`, preferences)
  }

  // ========== 어드민 API ==========
  async createHeritage(request: CreateHeritageRequest): Promise<ApiResponse<CreateHeritageResponse>> {
    return this.post<CreateHeritageResponse>('/admin/heritage', request)
  }

  async bulkCreateHeritage(request: BulkCreateHeritageRequest): Promise<ApiResponse<BulkCreateHeritageResponse>> {
    return this.post<BulkCreateHeritageResponse>('/admin/heritage/bulk', request)
  }

  // ========== 헬스체크 ==========
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.get('/health')
  }
}

// 싱글톤 인스턴스 생성
export const apiClient = new ApiClient()

// 타입 안전성을 위한 래퍼 함수들
export const chatAPI = {
  sendMessage: (request: ChatRequest) => apiClient.sendChatMessage(request),
  streamMessage: (
    request: ChatRequest,
    onMessage: (chunk: string) => void,
    onError?: (error: string) => void,
    onComplete?: () => void
  ) => apiClient.streamChatMessage(request, onMessage, onError, onComplete),
}

export const heritageAPI = {
  getNearby: (request: NearbyHeritageRequest) => apiClient.getNearbyHeritage(request),
}

export const ttsAPI = {
  getUrl: (request: TTSUrlRequest) => apiClient.getTTSUrl(request),
}

export const narrationAPI = {
  generate: (request: NarrationGenerateRequest) => apiClient.generateNarration(request),
}

export const poiAPI = {
  getNearby: (request: NearbyPOIRequest) => apiClient.getNearbyPOIs(request),
  getById: (id: string) => apiClient.getPOIById(id),
}

export const festivalAPI = {
  getAll: (request?: FestivalRequest) => apiClient.getFestivals(request),
  getById: (id: string) => apiClient.getFestivalById(id),
}

export const searchAPI = {
  search: (request: SearchRequest) => apiClient.search(request),
}

export const userAPI = {
  getUser: (userId: string) => apiClient.getUser(userId),
  updatePreferences: (userId: string, preferences: UserPreferences) =>
    apiClient.updateUserPreferences(userId, preferences),
}

export const adminAPI = {
  createHeritage: (request: CreateHeritageRequest) => apiClient.createHeritage(request),
  bulkCreateHeritage: (request: BulkCreateHeritageRequest) => apiClient.bulkCreateHeritage(request),
}

// 기본 내보내기
export default apiClient