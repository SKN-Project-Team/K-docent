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
  BulkCreateHeritageResponse,
  HeritageGenerateRequest,
  HeritageGenerateResponse,
  SingleHeritageGenerateRequest,
  AsyncHeritageGenerateResponse,
  JobStatusResponse,
  JobListResponse
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
    return this.post<ChatResponse>('/api/v1/chat', request)
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
    // age_group이 없으면 기본값으로 'adult' 설정
    const requestWithAgeGroup = {
      ...request,
      age_group: request.age_group || 'adult'
    }
    return this.post<CreateHeritageResponse>('/admin/heritage', requestWithAgeGroup)
  }

  async bulkCreateHeritage(request: BulkCreateHeritageRequest): Promise<ApiResponse<BulkCreateHeritageResponse>> {
    return this.post<BulkCreateHeritageResponse>('/admin/heritage/bulk', request)
  }

  // ========== 문화재 생성 API ==========
  // 동기 방식 (기존)
  async generateHeritage(request: HeritageGenerateRequest): Promise<ApiResponse<HeritageGenerateResponse>> {
    return this.post<HeritageGenerateResponse>('/api/v1/heritage-generation/generate', request)
  }

  async generateSingleHeritage(request: SingleHeritageGenerateRequest): Promise<ApiResponse<HeritageGenerateResponse>> {
    return this.post<HeritageGenerateResponse>('/api/v1/heritage-generation/generate/single', request)
  }

  // 백그라운드 방식 (신규)
  async generateHeritageAsync(request: HeritageGenerateRequest): Promise<ApiResponse<AsyncHeritageGenerateResponse>> {
    return this.post<AsyncHeritageGenerateResponse>('/api/v1/heritage-generation/generate/async', request)
  }

  // 파일 업로드 - 백그라운드 방식
  async uploadHeritageFileAsync(file: File, age_group: 'adult' | 'child' = 'adult'): Promise<ApiResponse<AsyncHeritageGenerateResponse>> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('age_group', age_group)

    return this.request<AsyncHeritageGenerateResponse>('/api/v1/heritage-generation/generate/async', {
      method: 'POST',
      headers: {
        // Content-Type을 설정하지 않음 - 브라우저가 자동으로 multipart/form-data로 설정
      },
      body: formData,
    })
  }

  // 작업 상태 조회
  async getJobStatus(jobId: string): Promise<ApiResponse<JobStatusResponse>> {
    return this.get<JobStatusResponse>(`/api/v1/heritage-generation/jobs/${jobId}/status`)
  }

  // 전체 작업 목록 조회
  async getJobList(): Promise<ApiResponse<JobListResponse>> {
    return this.get<JobListResponse>('/api/v1/heritage-generation/jobs')
  }

  // 작업 취소
  async cancelJob(jobId: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return this.delete<{ success: boolean; message: string }>(`/api/v1/heritage-generation/jobs/${jobId}`)
  }

  // 오래된 작업 정리
  async cleanupJobs(): Promise<ApiResponse<{ cleaned_count: number; message: string }>> {
    return this.post<{ cleaned_count: number; message: string }>('/api/v1/heritage-generation/jobs/cleanup')
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

export const heritageGenerationAPI = {
  // 동기 방식 (소규모 데이터용)
  generate: (request: HeritageGenerateRequest) => apiClient.generateHeritage(request),
  generateSingle: (request: SingleHeritageGenerateRequest) => apiClient.generateSingleHeritage(request),

  // 백그라운드 방식 (대용량 처리용)
  generateAsync: (request: HeritageGenerateRequest) => apiClient.generateHeritageAsync(request),
  uploadFileAsync: (file: File, age_group: 'adult' | 'child' = 'adult') => apiClient.uploadHeritageFileAsync(file, age_group),

  // 작업 관리
  getJobStatus: (jobId: string) => apiClient.getJobStatus(jobId),
  getJobList: () => apiClient.getJobList(),
  cancelJob: (jobId: string) => apiClient.cancelJob(jobId),
  cleanupJobs: () => apiClient.cleanupJobs(),
}

// 기본 내보내기
export default apiClient
