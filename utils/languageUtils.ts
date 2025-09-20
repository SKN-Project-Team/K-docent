// 지원 언어 목록과 언어 유틸리티

export interface SupportedLanguage {
  code: string
  name: string
  nativeName: string
  flag: string
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸'
  }
]

// 지원되는 언어 코드들
export const SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES.map(lang => lang.code)

// 기본 언어 (한국어)
export const DEFAULT_LANGUAGE = 'ko'

/**
 * 브라우저의 언어 설정을 감지하여 지원되는 언어 중에서 가장 적합한 언어를 반환
 */
export function detectBrowserLanguage(): string {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE
  }

  // 브라우저의 언어 목록 가져오기
  const browserLanguages = [
    navigator.language,
    ...(navigator.languages || [])
  ]

  // 브라우저 언어들을 순회하며 지원되는 언어 찾기
  for (const browserLang of browserLanguages) {
    // 정확한 매치 (예: 'ko-KR' -> 'ko')
    const langCode = browserLang.toLowerCase().split('-')[0]

    if (SUPPORTED_LANGUAGE_CODES.includes(langCode)) {
      return langCode
    }
  }

  // 매치되는 언어가 없으면 기본 언어 반환
  return DEFAULT_LANGUAGE
}

/**
 * 언어 코드로부터 언어 정보 객체 가져오기
 */
export function getLanguageInfo(code: string): SupportedLanguage | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code)
}

/**
 * 현재 언어가 지원되는 언어인지 확인
 */
export function isSupportedLanguage(code: string): boolean {
  return SUPPORTED_LANGUAGE_CODES.includes(code)
}

/**
 * 언어 코드 검증 및 기본값 반환
 */
export function validateLanguageCode(code: string): string {
  return isSupportedLanguage(code) ? code : DEFAULT_LANGUAGE
}

/**
 * 세션 스토리지에서 언어 설정 가져오기
 */
export function getStoredLanguage(): string {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE
  }

  try {
    const stored = sessionStorage.getItem('user-language')
    if (stored && isSupportedLanguage(stored)) {
      return stored
    }
  } catch (error) {
    console.warn('세션 스토리지에서 언어 설정을 읽는 중 오류 발생:', error)
  }

  return DEFAULT_LANGUAGE
}

/**
 * 세션 스토리지에 언어 설정 저장
 */
export function setStoredLanguage(languageCode: string): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const validatedCode = validateLanguageCode(languageCode)
    sessionStorage.setItem('user-language', validatedCode)
  } catch (error) {
    console.warn('세션 스토리지에 언어 설정을 저장하는 중 오류 발생:', error)
  }
}

/**
 * 초기 언어 설정 (세션 스토리지 우선, 없으면 브라우저 언어 감지)
 */
export function getInitialLanguage(): string {
  const storedLanguage = getStoredLanguage()

  // 세션 스토리지에 저장된 언어가 기본 언어가 아니면 그것을 사용
  if (storedLanguage !== DEFAULT_LANGUAGE) {
    return storedLanguage
  }

  // 저장된 언어가 없거나 기본 언어인 경우 브라우저 언어 감지
  return detectBrowserLanguage()
}