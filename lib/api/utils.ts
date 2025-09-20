import { ApiError } from './types'

// 에러 유틸리티
export class ApiClientError extends Error {
  public statusCode: number
  public timestamp: string
  public detail: string

  constructor(message: string) {
    super(message)
    this.name = 'ApiClientError'

    try {
      const errorData: ApiError = JSON.parse(message)
      this.statusCode = errorData.status_code
      this.timestamp = errorData.timestamp
      this.detail = errorData.detail
    } catch {
      this.statusCode = 500
      this.timestamp = new Date().toISOString()
      this.detail = message
    }
  }

  // 에러 타입 체크 메서드들
  isNetworkError(): boolean {
    return this.statusCode === 408 || this.detail.includes('timeout') || this.detail.includes('network')
  }

  isServerError(): boolean {
    return this.statusCode >= 500
  }

  isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500
  }

  isAuthError(): boolean {
    return this.statusCode === 401 || this.statusCode === 403
  }

  isNotFound(): boolean {
    return this.statusCode === 404
  }

  // 사용자 친화적인 에러 메시지 생성
  getUserFriendlyMessage(): string {
    if (this.isNetworkError()) {
      return '네트워크 연결을 확인해주세요.'
    }

    if (this.isAuthError()) {
      return '인증이 필요합니다. 다시 로그인해주세요.'
    }

    if (this.isNotFound()) {
      return '요청하신 정보를 찾을 수 없습니다.'
    }

    if (this.isServerError()) {
      return '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
    }

    if (this.isClientError()) {
      return '요청에 문제가 있습니다. 입력 내용을 확인해주세요.'
    }

    return '알 수 없는 오류가 발생했습니다.'
  }
}

// API 응답 결과 처리 유틸리티
export function handleApiResponse<T>(
  apiCall: () => Promise<{ data: T; status: string; message?: string }>
) {
  return {
    // 성공 케이스만 처리
    async execute(): Promise<T> {
      try {
        const response = await apiCall()
        return response.data
      } catch (error) {
        throw new ApiClientError(error instanceof Error ? error.message : String(error))
      }
    },

    // 에러 핸들링 포함 처리
    async executeWithErrorHandling(): Promise<{
      data: T | null
      error: ApiClientError | null
      isLoading: boolean
    }> {
      try {
        const response = await apiCall()
        return {
          data: response.data,
          error: null,
          isLoading: false,
        }
      } catch (error) {
        return {
          data: null,
          error: new ApiClientError(error instanceof Error ? error.message : String(error)),
          isLoading: false,
        }
      }
    },
  }
}

// 재시도 로직
export async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  backoffMs: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // 마지막 시도이거나 재시도 불가능한 에러인 경우
      if (attempt === maxRetries) {
        break
      }

      const apiError = new ApiClientError(lastError.message)

      // 재시도하지 않을 에러들
      if (apiError.isClientError() && !apiError.isAuthError()) {
        break
      }

      // 백오프 대기
      await new Promise(resolve => setTimeout(resolve, backoffMs * Math.pow(2, attempt)))
    }
  }

  throw lastError!
}

// 환경변수 유틸리티
export function getApiConfig() {
  return {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
    retryCount: parseInt(process.env.NEXT_PUBLIC_API_RETRY_COUNT || '3'),
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  }
}

// 로깅 유틸리티
export function logApiCall(
  method: string,
  url: string,
  duration: number,
  success: boolean,
  error?: ApiClientError
) {
  if (getApiConfig().isDevelopment) {
    const logLevel = success ? 'log' : 'error'
    const message = `API ${method} ${url} - ${duration}ms - ${success ? 'SUCCESS' : 'FAILED'}`

    console[logLevel](message, error ? { error: error.detail } : {})
  }
}

// 디바운스 유틸리티 (검색 등에 사용)
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), waitMs)
  }
}

// 위치 유틸리티
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// 데이터 검증 유틸리티
export function validateLocation(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180 &&
    !isNaN(lat) && !isNaN(lng)
  )
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 캐시 유틸리티 (메모리 기반 단순 캐시)
class SimpleCache<T> {
  private cache = new Map<string, { data: T; timestamp: number; ttl: number }>()

  set(key: string, data: T, ttlMs: number = 300000): void { // 기본 5분
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    })
  }

  get(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): void {
    this.cache.delete(key)
  }
}

export const apiCache = new SimpleCache()

// URL 빌더 유틸리티
export function buildURL(baseURL: string, endpoint: string, params?: Record<string, any>): string {
  const url = new URL(endpoint, baseURL)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return url.toString()
}