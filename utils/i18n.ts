// 다국어 지원을 위한 텍스트 정의

export interface Translations {
  [key: string]: {
    ko: string
    en: string
    zh: string
    ja: string
    fr: string
    de: string
    es: string
  }
}

export const translations: Translations = {
  // 공통
  'common.home': {
    ko: '홈',
    en: 'Home',
    zh: '首页',
    ja: 'ホーム',
    fr: 'Accueil',
    de: 'Startseite',
    es: 'Inicio'
  },
  'common.map': {
    ko: '지도',
    en: 'Map',
    zh: '地图',
    ja: '地図',
    fr: 'Carte',
    de: 'Karte',
    es: 'Mapa'
  },

  // 네비게이션
  'nav.home': {
    ko: '홈',
    en: 'Home',
    zh: '首页',
    ja: 'ホーム',
    fr: 'Accueil',
    de: 'Startseite',
    es: 'Inicio'
  },
  'nav.map': {
    ko: '지도',
    en: 'Map',
    zh: '地图',
    ja: '地図',
    fr: 'Carte',
    de: 'Karte',
    es: 'Mapa'
  },
  'nav.chat': {
    ko: '채팅',
    en: 'Chat',
    zh: '聊天',
    ja: 'チャット',
    fr: 'Chat',
    de: 'Chat',
    es: 'Chat'
  },
  'common.search': {
    ko: '어디로 가보시겠어요?',
    en: 'Where would you like to go?',
    zh: '您想去哪里？',
    ja: 'どちらに行きますか？',
    fr: 'Où aimeriez-vous aller ?',
    de: 'Wo möchten Sie hingehen?',
    es: '¿A dónde te gustaría ir?'
  },
  'common.searchHeritage': {
    ko: '문화재를 검색해보세요...',
    en: 'Search for heritage sites...',
    zh: '搜索文化遗产...',
    ja: '文化財を検索してください...',
    fr: 'Rechercher des sites patrimoniaux...',
    de: 'Nach Kulturerbe suchen...',
    es: 'Buscar sitios patrimoniales...'
  },
  'common.details': {
    ko: '자세히 보기',
    en: 'View Details',
    zh: '查看详情',
    ja: '詳細を見る',
    fr: 'Voir les détails',
    de: 'Details anzeigen',
    es: 'Ver detalles'
  },
  'common.aiGuide': {
    ko: 'AI해설사',
    en: 'AI Guide',
    zh: 'AI导游',
    ja: 'AIガイド',
    fr: 'Guide IA',
    de: 'KI-Führer',
    es: 'Guía IA'
  },
  'common.askQuestion': {
    ko: '질문하기',
    en: 'Ask Question',
    zh: '提问',
    ja: '質問する',
    fr: 'Poser une question',
    de: 'Frage stellen',
    es: 'Hacer pregunta'
  },

  // 채팅 관련
  'chat.aiDocent': {
    ko: 'K-Docent',
    en: 'K-Docent',
    zh: 'K-Docent',
    ja: 'K-Docent',
    fr: 'K-Docent',
    de: 'K-Docent',
    es: 'K-Docent'
  },
  'chat.suggestedQuestions': {
    ko: '추천 질문',
    en: 'Suggested Questions',
    zh: '推荐问题',
    ja: 'おすすめの質問',
    fr: 'Questions suggérées',
    de: 'Vorgeschlagene Fragen',
    es: 'Preguntas sugeridas'
  },
  'chat.placeholder': {
    ko: '문화재나 역사에 대해 궁금한 것을 물어보세요...',
    en: 'Ask about cultural heritage or history...',
    zh: '询问有关文化遗产或历史的问题...',
    ja: '文化財や歴史について質問してください...',
    fr: 'Posez des questions sur le patrimoine culturel ou l\'histoire...',
    de: 'Fragen Sie nach Kulturerbe oder Geschichte...',
    es: 'Pregunta sobre patrimonio cultural o historia...'
  },

  // 나레이션 생성 관련
  'narration.generateSuccess': {
    ko: '나레이션이 성공적으로 생성되었습니다!',
    en: 'Narration generated successfully!',
    zh: '解说生成成功！',
    ja: 'ナレーションが正常に生成されました！',
    fr: 'Narration générée avec succès !',
    de: 'Erzählung erfolgreich erstellt!',
    es: '¡Narración generada exitosamente!'
  },
  'narration.generateError': {
    ko: '나레이션 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    en: 'An error occurred while generating narration. Please try again later.',
    zh: '生成解说时发生错误。请稍后重试。',
    ja: 'ナレーション生成中にエラーが発生しました。しばらくしてから再試行してください。',
    fr: 'Une erreur s\'est produite lors de la génération de la narration. Veuillez réessayer plus tard.',
    de: 'Bei der Generierung der Erzählung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
    es: 'Ocurrió un error al generar la narración. Por favor, inténtelo de nuevo más tarde.'
  },
  'common.cancel': {
    ko: '취소',
    en: 'Cancel',
    zh: '取消',
    ja: 'キャンセル',
    fr: 'Annuler',
    de: 'Abbrechen',
    es: 'Cancelar'
  },
  'common.confirm': {
    ko: '확인',
    en: 'Confirm',
    zh: '确认',
    ja: '確認',
    fr: 'Confirmer',
    de: 'Bestätigen',
    es: 'Confirmar'
  },
  'common.retry': {
    ko: '다시 시도',
    en: 'Retry',
    zh: '重试',
    ja: 'リトライ',
    fr: 'Réessayer',
    de: 'Erneut versuchen',
    es: 'Reintentar'
  },

  // 나레이션 모드
  'narration.selectType': {
    ko: '나레이션 설명 타입을 선택해 주세요:',
    en: 'Please select narration type:',
    zh: '请选择解说类型：',
    ja: 'ナレーションタイプを選択してください：',
    fr: 'Veuillez sélectionner le type de narration :',
    de: 'Bitte wählen Sie den Erzähltyp:',
    es: 'Por favor seleccione el tipo de narración:'
  },
  'narration.childrenMode': {
    ko: '어린이 모드',
    en: 'Children Mode',
    zh: '儿童模式',
    ja: '子供モード',
    fr: 'Mode Enfant',
    de: 'Kindermodus',
    es: 'Modo Niños'
  },
  'narration.adultMode': {
    ko: '어른 모드',
    en: 'Adult Mode',
    zh: '成人模式',
    ja: '大人モード',
    fr: 'Mode Adulte',
    de: 'Erwachsenenmodus',
    es: 'Modo Adulto'
  },
  'narration.childrenDescription': {
    ko: '재미있고 쉬운 설명',
    en: 'Fun and easy explanations',
    zh: '有趣易懂的解说',
    ja: '楽しくて分かりやすい説明',
    fr: 'Explications amusantes et faciles',
    de: 'Spaßige und einfache Erklärungen',
    es: 'Explicaciones divertidas y fáciles'
  },
  'narration.adultDescription': {
    ko: '자세하고 전문적인 설명',
    en: 'Detailed and professional explanations',
    zh: '详细专业的解说',
    ja: '詳しくて専門的な説明',
    fr: 'Explications détaillées et professionnelles',
    de: 'Detaillierte und professionelle Erklärungen',
    es: 'Explicaciones detalladas y profesionales'
  },

  // 문화재 관련
  'heritage.recommended': {
    ko: '추천 관광지 및 문화재',
    en: 'Recommended Tourism Sites and Heritage',
    zh: '推荐旅游景点和文化遗产',
    ja: 'おすすめ観光地と文化財',
    fr: 'Sites touristiques et patrimoine recommandés',
    de: 'Empfohlene Tourismusstandorte und Kulturerbe',
    es: 'Sitios turísticos y patrimonio recomendados'
  },
  'heritage.currentLocationDescription': {
    ko: '현재 위치에서 {radius}km 이내의 관광지를 {mode}로 안내해드립니다.',
    en: 'We guide you to tourism sites within {radius}km of your current location in {mode}.',
    zh: '为您介绍当前位置{radius}公里范围内的旅游景点，使用{mode}模式。',
    ja: '現在地から{radius}km以内の観光地を{mode}でご案内します。',
    fr: 'Nous vous guidons vers des sites touristiques dans un rayon de {radius}km de votre position actuelle en {mode}.',
    de: 'Wir führen Sie zu Tourismusstandorten innerhalb von {radius}km von Ihrem aktuellen Standort im {mode}.',
    es: 'Te guiamos a sitios turísticos dentro de {radius}km de tu ubicación actual en {mode}.'
  },
  'heritage.locationPermissionDescription': {
    ko: '위치 정보를 허용하면 주변 관광지를 추천받을 수 있습니다.',
    en: 'Allow location access to receive recommendations for nearby tourist sites.',
    zh: '允许位置信息后可获得周边旅游景点推荐。',
    ja: '位置情報を許可すると、周辺の観光地をおすすめできます。',
    fr: 'Autorisez l\'accès à la localisation pour recevoir des recommandations de sites touristiques à proximité.',
    de: 'Erlauben Sie den Standortzugriff, um Empfehlungen für nahegelegene Tourismusstandorte zu erhalten.',
    es: 'Permite el acceso a la ubicación para recibir recomendaciones de sitios turísticos cercanos.'
  },
  'heritage.locationLoading': {
    ko: '위치 정보를 가져오는 중...',
    en: 'Getting location information...',
    zh: '正在获取位置信息...',
    ja: '位置情報を取得中...',
    fr: 'Obtention des informations de localisation...',
    de: 'Standortinformationen werden abgerufen...',
    es: 'Obteniendo información de ubicación...'
  },
  'heritage.noResults': {
    ko: '검색 결과 없음',
    en: 'No search results',
    zh: '无搜索结果',
    ja: '検索結果なし',
    fr: 'Aucun résultat de recherche',
    de: 'Keine Suchergebnisse',
    es: 'Sin resultados de búsqueda'
  },
  'heritage.tryDifferentKeyword': {
    ko: '다른 키워드로 검색해보세요',
    en: 'Try searching with different keywords',
    zh: '请尝试使用其他关键词搜索',
    ja: '別のキーワードで検索してみてください',
    fr: 'Essayez de rechercher avec des mots-clés différents',
    de: 'Versuchen Sie es mit anderen Suchbegriffen',
    es: 'Intenta buscar con palabras clave diferentes'
  },
  'heritage.nearbyNotFound': {
    ko: '근처에 문화재가 없습니다',
    en: 'No heritage sites found nearby',
    zh: '附近没有文化遗产',
    ja: '近くに文化財がありません',
    fr: 'Aucun site patrimonial trouvé à proximité',
    de: 'Keine Kulturerbestätten in der Nähe gefunden',
    es: 'No se encontraron sitios patrimoniales cercanos'
  },
  'heritage.exploreOtherAreas': {
    ko: '다른 지역을 탐색해보세요',
    en: 'Explore other areas',
    zh: '请探索其他地区',
    ja: '他の地域を探索してみてください',
    fr: 'Explorez d\'autres zones',
    de: 'Erkunden Sie andere Gebiete',
    es: 'Explora otras áreas'
  },
  'heritage.errorLoading': {
    ko: '문화재 정보를 불러오는 중 오류가 발생했습니다.',
    en: 'An error occurred while loading heritage information.',
    zh: '加载文化遗产信息时发生错误。',
    ja: '文化財情報の読み込み中にエラーが発生しました。',
    fr: 'Une erreur s\'est produite lors du chargement des informations patrimoniales.',
    de: 'Beim Laden der Kulturerbe-Informationen ist ein Fehler aufgetreten.',
    es: 'Ocurrió un error al cargar la información del patrimonio.'
  },
  'heritage.audioGuide': {
    ko: '음성해설',
    en: 'Audio Guide',
    zh: '语音导览',
    ja: '音声ガイド',
    fr: 'Guide audio',
    de: 'Audioführung',
    es: 'Guía de audio'
  },
  'heritage.more': {
    ko: '더 많은 문화재',
    en: 'More Heritage Sites',
    zh: '更多文化遗产',
    ja: 'より多くの文化財',
    fr: 'Plus de sites patrimoniaux',
    de: 'Weitere Kulturerbestätten',
    es: 'Más sitios patrimoniales'
  },
  'heritage.viewAll': {
    ko: '전체 목록 보기',
    en: 'View All List',
    zh: '查看全部列表',
    ja: '全リストを見る',
    fr: 'Voir toute la liste',
    de: 'Alle anzeigen',
    es: 'Ver toda la lista'
  },

  // 나레이션 버튼
  'narration.play': {
    ko: '재생',
    en: 'Play',
    zh: '播放',
    ja: '再生',
    fr: 'Lecture',
    de: 'Wiedergabe',
    es: 'Reproducir'
  },
  'narration.pause': {
    ko: '일시정지',
    en: 'Pause',
    zh: '暂停',
    ja: '一時停止',
    fr: 'Pause',
    de: 'Pause',
    es: 'Pausa'
  },
  'narration.generate': {
    ko: '음성생성',
    en: 'Generate Audio',
    zh: '生成语音',
    ja: '音声生成',
    fr: 'Générer l\'audio',
    de: 'Audio generieren',
    es: 'Generar audio'
  },

  // 나레이션 생성 모달
  'narration.generateRequest': {
    ko: '나레이션 생성 요청',
    en: 'Narration Generation Request',
    zh: '解说生成请求',
    ja: 'ナレーション生成リクエスト',
    fr: 'Demande de génération de narration',
    de: 'Anfrage zur Erzählungsgenerierung',
    es: 'Solicitud de generación de narración'
  },
  'narration.generateConfirm': {
    ko: '"{name}"에 대한 음성 나레이션을 생성하시겠습니까?',
    en: 'Would you like to generate audio narration for "{name}"?',
    zh: '您想为"{name}"生成语音解说吗？',
    ja: '"{name}"の音声ナレーションを生成しますか？',
    fr: 'Souhaitez-vous générer une narration audio pour "{name}" ?',
    de: 'Möchten Sie eine Audio-Erzählung für "{name}" generieren?',
    es: '¿Te gustaría generar narración de audio para "{name}"?'
  },
  'narration.selectedMode': {
    ko: '선택된 모드:',
    en: 'Selected Mode:',
    zh: '选择的模式：',
    ja: '選択されたモード：',
    fr: 'Mode sélectionné :',
    de: 'Ausgewählter Modus:',
    es: 'Modo seleccionado:'
  },
  'narration.generationTime': {
    ko: '생성 시간: 약 30초 - 1분',
    en: 'Generation time: About 30 seconds - 1 minute',
    zh: '生成时间：约30秒-1分钟',
    ja: '生成時間：約30秒〜1分',
    fr: 'Temps de génération : Environ 30 secondes - 1 minute',
    de: 'Generierungszeit: Etwa 30 Sekunden - 1 Minute',
    es: 'Tiempo de generación: Aproximadamente 30 segundos - 1 minuto'
  },
  'narration.generating': {
    ko: '나레이션 생성 중...',
    en: 'Generating narration...',
    zh: '正在生成解说...',
    ja: 'ナレーション生成中...',
    fr: 'Génération de la narration...',
    de: 'Erzählung wird generiert...',
    es: 'Generando narración...'
  },
  'narration.pleaseWait': {
    ko: '잠시만 기다려 주세요.',
    en: 'Please wait a moment.',
    zh: '请稍等。',
    ja: 'しばらくお待ちください。',
    fr: 'Veuillez patienter un moment.',
    de: 'Bitte warten Sie einen Moment.',
    es: 'Por favor espera un momento.'
  },
  'narration.requestGeneration': {
    ko: '생성 요청',
    en: 'Request Generation',
    zh: '请求生成',
    ja: '生成リクエスト',
    fr: 'Demander la génération',
    de: 'Generierung anfordern',
    es: 'Solicitar generación'
  },
  'narration.generateConfirmation': {
    ko: '"{heritageName}"에 대한 음성 나레이션을 생성하시겠습니까?',
    en: 'Would you like to generate audio narration for "{heritageName}"?',
    zh: '您想为"{heritageName}"生成语音解说吗？',
    ja: '"{heritageName}"の音声ナレーションを生成しますか？',
    fr: 'Souhaitez-vous générer une narration audio pour "{heritageName}" ?',
    de: 'Möchten Sie eine Audio-Erzählung für "{heritageName}" generieren?',
    es: '¿Te gustaría generar narración de audio para "{heritageName}"?'
  },
  'narration.childrenModeDescription': {
    ko: '재미있고 쉬운 설명으로 생성됩니다',
    en: 'Generated with fun and easy explanations',
    zh: '将以有趣易懂的方式生成',
    ja: '楽しくて分かりやすい説明で生成されます',
    fr: 'Généré avec des explications amusantes et faciles',
    de: 'Mit spaßigen und einfachen Erklärungen erstellt',
    es: 'Generado con explicaciones divertidas y fáciles'
  },
  'narration.adultModeDescription': {
    ko: '자세하고 전문적인 설명으로 생성됩니다',
    en: 'Generated with detailed and professional explanations',
    zh: '将以详细专业的方式生成',
    ja: '詳しくて専門的な説明で生成されます',
    fr: 'Généré avec des explications détaillées et professionnelles',
    de: 'Mit detaillierten und professionellen Erklärungen erstellt',
    es: 'Generado con explicaciones detalladas y profesionales'
  },

  // 언어 선택 모달
  'language.selection': {
    ko: '언어 선택',
    en: 'Language Selection',
    zh: '语言选择',
    ja: '言語選択',
    fr: 'Sélection de langue',
    de: 'Sprachauswahl',
    es: 'Selección de idioma'
  },

  // 행사/체험/교육 프로그램
  'events.title': {
    ko: '행사/체험/교육 프로그램',
    en: 'Events/Experience/Education Programs',
    zh: '活动/体验/教育项目',
    ja: 'イベント/体験/教育プログラム',
    fr: 'Événements/Expérience/Programmes éducatifs',
    de: 'Veranstaltungen/Erfahrung/Bildungsprogramme',
    es: 'Eventos/Experiencia/Programas educativos'
  },
  'events.description': {
    ko: '국가유산을 새롭게 경험해보세요.',
    en: 'Experience national heritage in new ways.',
    zh: '以全新方式体验国家遗产。',
    ja: '国家遺産を新しく体験してみてください。',
    fr: 'Découvrez le patrimoine national de nouvelles façons.',
    de: 'Erleben Sie das nationale Erbe auf neue Weise.',
    es: 'Experimenta el patrimonio nacional de nuevas maneras.'
  },
  'events.ongoing': {
    ko: '진행중',
    en: 'Ongoing',
    zh: '进行中',
    ja: '進行中',
    fr: 'En cours',
    de: 'Laufend',
    es: 'En curso'
  },
  'events.viewLocation': {
    ko: '위치 보기',
    en: 'View Location',
    zh: '查看位置',
    ja: '場所を見る',
    fr: 'Voir l\'emplacement',
    de: 'Standort anzeigen',
    es: 'Ver ubicación'
  },
  'events.dataError': {
    ko: '데이터 로딩 오류',
    en: 'Data Loading Error',
    zh: '数据加载错误',
    ja: 'データ読み込みエラー',
    fr: 'Erreur de chargement des données',
    de: 'Datenladefehler',
    es: 'Error de carga de datos'
  },
  'events.noEvents': {
    ko: '축제 정보 없음',
    en: 'No Festival Information',
    zh: '无节庆信息',
    ja: '祭り情報なし',
    fr: 'Aucune information sur les festivals',
    de: 'Keine Festivalinformationen',
    es: 'Sin información de festivales'
  },
  'events.noCurrentEvents': {
    ko: '현재 진행중인 축제가 없습니다.',
    en: 'No festivals currently in progress.',
    zh: '目前没有正在进行的节庆活动。',
    ja: '現在進行中の祭りはありません。',
    fr: 'Aucun festival en cours actuellement.',
    de: 'Derzeit finden keine Festivals statt.',
    es: 'No hay festivales en curso actualmente.'
  }
}

/**
 * 다국어 텍스트 가져오기 함수
 */
export function getTranslation(key: string, language: string, params?: Record<string, string>): string {
  const translation = translations[key]
  if (!translation) {
    console.warn(`Translation key "${key}" not found`)
    return key
  }

  const lang = language as keyof typeof translation
  let text = translation[lang] || translation.ko

  // 매개변수 치환
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), value)
    })
  }

  return text
}

/**
 * React Hook for translations
 */
export function useTranslation(language: string) {
  return {
    t: (key: string, params?: Record<string, string>) => getTranslation(key, language, params)
  }
}