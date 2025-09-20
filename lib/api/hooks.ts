// React 훅들 - API 클라이언트와 함께 사용

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  ApiResponse,
  ChatRequest,
  ChatResponse,
  NearbyPOIRequest,
  POI,
  TouristSpot,
  Festival,
  FestivalRequest,
  SearchRequest,
  SearchResult,
  NearbyHeritageRequest,
  NearbyHeritageResponse,
} from './types'
import { chatAPI, heritageAPI, poiAPI, festivalAPI, searchAPI } from './client'
import { ApiClientError, handleApiResponse, debounce, apiCache } from './utils'

// 기본 API 호출 훅
export function useApiCall<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiClientError | null>(null)

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await handleApiResponse(apiCall).execute()
      setData(response)
    } catch (err) {
      setError(err instanceof ApiClientError ? err : new ApiClientError(String(err)))
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, execute, reset }
}

// 채팅 훅
export function useChat() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiClientError | null>(null)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const sendMessage = useCallback(async (request: ChatRequest) => {
    setLoading(true)
    setError(null)
    setStreamingMessage('')
    setIsStreaming(false)

    // 사용자 메시지 추가
    setMessages(prev => [...prev, { role: 'user', content: request.message }])

    try {
      // 스트리밍 모드
      if (window.ReadableStream) {
        setIsStreaming(true)
        let fullResponse = ''

        await chatAPI.streamMessage(
          request,
          (chunk: string) => {
            fullResponse += chunk
            setStreamingMessage(fullResponse)
          },
          (error: string) => {
            setError(new ApiClientError(error))
            setIsStreaming(false)
          },
          () => {
            setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }])
            setStreamingMessage('')
            setIsStreaming(false)
          }
        )
      } else {
        // 일반 모드 (폴백)
        const response = await chatAPI.sendMessage(request)
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }])
      }
    } catch (err) {
      setError(err instanceof ApiClientError ? err : new ApiClientError(String(err)))
    } finally {
      setLoading(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setStreamingMessage('')
    setError(null)
  }, [])

  return {
    messages,
    loading,
    error,
    streamingMessage,
    isStreaming,
    sendMessage,
    clearMessages,
  }
}

// 근처 문화재 훅
export function useNearbyHeritage(request?: NearbyHeritageRequest) {
  const { data, loading, error, execute } = useApiCall<NearbyHeritageResponse>()
  const [hasAttempted, setHasAttempted] = useState(false)
  const previousRequestRef = useRef<string>('')

  const fetchNearbyHeritage = useCallback((newRequest: NearbyHeritageRequest) => {
    const cacheKey = `nearby-heritage-${JSON.stringify(newRequest)}`
    const cached = apiCache.get<NearbyHeritageResponse>(cacheKey)

    if (cached) {
      return Promise.resolve({ data: cached, status: 'success' as const })
    }

    setHasAttempted(true)
    return execute(() => heritageAPI.getNearby(newRequest)).then(() => {
      if (data) {
        apiCache.set(cacheKey, data, 300000) // 5분 캐시
      }
    })
  }, [execute, data])

  useEffect(() => {
    if (request) {
      const currentRequestKey = JSON.stringify(request)

      // 요청이 변경되었거나 처음 요청하는 경우
      if (currentRequestKey !== previousRequestRef.current) {
        setHasAttempted(false) // 새로운 요청이므로 플래그 리셋
        previousRequestRef.current = currentRequestKey
      }

      // 요청이 있고, 아직 시도하지 않았으며, 현재 로딩 중이 아닐 때만 실행
      if (!hasAttempted && !loading) {
        fetchNearbyHeritage(request)
      }
    }
  }, [request, hasAttempted, loading, fetchNearbyHeritage])

  const manualRefetch = useCallback((newRequest: NearbyHeritageRequest) => {
    setHasAttempted(false) // 수동 재시도 시 플래그 리셋
    previousRequestRef.current = JSON.stringify(newRequest)
    return fetchNearbyHeritage(newRequest)
  }, [fetchNearbyHeritage])

  return { heritage: data, loading, error, refetch: manualRefetch }
}

// 근처 POI 훅
export function useNearbyPOIs(request?: NearbyPOIRequest) {
  const { data, loading, error, execute } = useApiCall<POI[]>()

  const fetchNearbyPOIs = useCallback((newRequest: NearbyPOIRequest) => {
    const cacheKey = `nearby-pois-${JSON.stringify(newRequest)}`
    const cached = apiCache.get<POI[]>(cacheKey)

    if (cached) {
      return Promise.resolve({ data: cached, status: 'success' as const })
    }

    return execute(() => poiAPI.getNearby(newRequest)).then(() => {
      if (data) {
        apiCache.set(cacheKey, data, 300000) // 5분 캐시
      }
    })
  }, [execute, data])

  useEffect(() => {
    if (request) {
      fetchNearbyPOIs(request)
    }
  }, [request, fetchNearbyPOIs])

  return { pois: data, loading, error, refetch: fetchNearbyPOIs }
}

// POI 상세 정보 훅
export function usePOI(id?: string) {
  const { data, loading, error, execute } = useApiCall<TouristSpot>()

  const fetchPOI = useCallback((poiId: string) => {
    const cacheKey = `poi-${poiId}`
    const cached = apiCache.get<TouristSpot>(cacheKey)

    if (cached) {
      return Promise.resolve({ data: cached, status: 'success' as const })
    }

    return execute(() => poiAPI.getById(poiId)).then(() => {
      if (data) {
        apiCache.set(cacheKey, data, 600000) // 10분 캐시
      }
    })
  }, [execute, data])

  useEffect(() => {
    if (id) {
      fetchPOI(id)
    }
  }, [id, fetchPOI])

  return { poi: data, loading, error, refetch: fetchPOI }
}

// 축제 목록 훅
export function useFestivals(request?: FestivalRequest) {
  const { data, loading, error, execute } = useApiCall<Festival[]>()

  const fetchFestivals = useCallback((newRequest?: FestivalRequest) => {
    const cacheKey = `festivals-${JSON.stringify(newRequest || {})}`
    const cached = apiCache.get<Festival[]>(cacheKey)

    if (cached) {
      return Promise.resolve({ data: cached, status: 'success' as const })
    }

    return execute(() => festivalAPI.getAll(newRequest)).then(() => {
      if (data) {
        apiCache.set(cacheKey, data, 600000) // 10분 캐시
      }
    })
  }, [execute, data])

  useEffect(() => {
    fetchFestivals(request)
  }, [request, fetchFestivals])

  return { festivals: data, loading, error, refetch: fetchFestivals }
}

// 검색 훅 (디바운스 적용)
export function useSearch() {
  const { data, loading, error, execute } = useApiCall<SearchResult>()
  const [query, setQuery] = useState('')
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  const debouncedSearch = useCallback(
    debounce((searchRequest: SearchRequest) => {
      if (searchRequest.query.trim()) {
        execute(() => searchAPI.search(searchRequest))
      }
    }, 500),
    [execute]
  )

  const search = useCallback((request: SearchRequest) => {
    setQuery(request.query)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    debouncedSearch(request)
  }, [debouncedSearch])

  const clearSearch = useCallback(() => {
    setQuery('')
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
  }, [])

  return {
    results: data,
    loading,
    error,
    query,
    search,
    clearSearch,
  }
}

// 위치 기반 훅
export function useGeolocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('위치 서비스가 지원되지 않습니다.')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLoading(false)
      },
      (err) => {
        setError('위치를 가져올 수 없습니다.')
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분
      }
    )
  }, [])

  useEffect(() => {
    // 컴포넌트 마운트 시 자동으로 위치 가져오기
    getCurrentLocation()
  }, [getCurrentLocation])

  return {
    location,
    loading,
    error,
    refetch: getCurrentLocation,
  }
}