import { MultilingualText } from "@/types"

export function getTranslatedText(text: MultilingualText, language: string): string {
  return text[language as keyof MultilingualText] || text.ko
}

// UI 텍스트 번역
export const uiTexts = {
  searchPlaceholder: {
    ko: "문화유적지를 검색하세요...",
    ja: "文化遺跡を検索してください...",
    en: "Search cultural sites...",
    zh: "搜索文化遗址...",
    es: "Buscar sitios culturales...",
    fr: "Rechercher des sites culturels..."
  },
  refreshTitle: {
    ko: "주변 문화유적지 새로고침",
    ja: "周辺文化遺跡の更新",
    en: "Refresh nearby cultural sites",
    zh: "刷新附近文化遗址",
    es: "Actualizar sitios culturales cercanos",
    fr: "Actualiser les sites culturels à proximité"
  },
  noResultsTitle: {
    ko: "검색 결과가 없습니다",
    ja: "検索結果がありません",
    en: "No search results",
    zh: "没有搜索结果",
    es: "No hay resultados de búsqueda",
    fr: "Aucun résultat de recherche"
  },
  noResultsDescription: {
    ko: "다른 키워드로 검색해보세요",
    ja: "他のキーワードで検索してみてください",
    en: "Try searching with different keywords",
    zh: "请尝试其他关键词搜索",
    es: "Intenta buscar con diferentes palabras clave",
    fr: "Essayez de rechercher avec d'autres mots-clés"
  },
  aiNarration: {
    ko: "AI 나레이션",
    ja: "AIナレーション",
    en: "AI Narration",
    zh: "AI解说",
    es: "Narración de IA",
    fr: "Narration IA"
  },
  chatButton: {
    ko: "채팅",
    ja: "チャット",
    en: "Chat",
    zh: "聊天",
    es: "Chat",
    fr: "Chat"
  },
  appTitle: {
    ko: "한국문화 AI 나레이터",
    ja: "韓国文化AIガイド",
    en: "Korean Culture AI Guide",
    zh: "韩国文化AI指南",
    es: "Guía de IA de Cultura Coreana",
    fr: "Guide IA de la Culture Coréenne"
  },
  appSubtitle: {
    ko: "전통과 현대가 만나는 문화 여행",
    ja: "伝統と現代が出会う文化の旅",
    en: "Cultural journey where tradition meets modernity",
    zh: "传统与现代交融的文化之旅",
    es: "Viaje cultural donde la tradición se encuentra con la modernidad",
    fr: "Voyage culturel où la tradition rencontre la modernité"
  },
  aiGuide: {
    ko: "AI 나레이터",
    ja: "AIガイド", 
    en: "AI Guide",
    zh: "AI指南",
    es: "Guía de IA",
    fr: "Guide IA"
  },
  askEverything: {
    ko: "에 대해 궁금한 모든 것을 물어보세요",
    ja: "について知りたいことは何でも聞いてください",
    en: "Ask anything you want to know about",
    zh: "有什么想了解的都可以问",
    es: "Pregunta todo lo que quieras saber sobre",
    fr: "Posez toutes vos questions sur"
  },
  levelLabel: {
    ko: "설명 수준",
    ja: "説明レベル",
    en: "Explanation Level",
    zh: "说明级别", 
    es: "Nivel de Explicación",
    fr: "Niveau d'Explication"
  },
  expert: {
    ko: "전문가",
    ja: "専門家",
    en: "Expert",
    zh: "专家",
    es: "Experto",
    fr: "Expert"
  },
  adult: {
    ko: "성인",
    ja: "大人",
    en: "Adult", 
    zh: "成人",
    es: "Adulto",
    fr: "Adulte"
  },
  children: {
    ko: "어린이",
    ja: "子供",
    en: "Children",
    zh: "儿童", 
    es: "Niños",
    fr: "Enfants"
  },
  culturalGuide: {
    ko: "전통문화 AI 해설사",
    ja: "伝統文化AI解説者",
    en: "Traditional Culture AI Guide",
    zh: "传统文化AI解说员",
    es: "Guía de IA de Cultura Tradicional", 
    fr: "Guide IA de Culture Traditionnelle"
  },
  references: {
    ko: "참고 자료:",
    ja: "参考資料：",
    en: "References:",
    zh: "参考资料：",
    es: "Referencias:",
    fr: "Références :"
  },
  recommendedQuestions: {
    ko: "추천 질문",
    ja: "おすすめの質問",
    en: "Recommended Questions", 
    zh: "推荐问题",
    es: "Preguntas Recomendadas",
    fr: "Questions Recommandées"
  },
  chatPlaceholder: {
    ko: "의 역사, 문화, 특징에 대해 궁금한 것을 물어보세요...",
    ja: "の歴史、文化、特徴について知りたいことを聞いてください...",
    en: "'s history, culture, and features...",
    zh: "的历史、文化、特色等问题...",
    es: " sobre su historia, cultura y características...",
    fr: " sur son histoire, sa culture et ses caractéristiques..."
  },
  avatarLetter: {
    ko: "한",
    ja: "韓",
    en: "K",
    zh: "韩",
    es: "C",
    fr: "C"
  },
  list: {
    ko: "리스트",
    ja: "リスト",
    en: "List",
    zh: "列表",
    es: "Lista",
    fr: "Liste"
  },
  map: {
    ko: "지도",
    ja: "地図",
    en: "Map",
    zh: "地图",
    es: "Mapa",
    fr: "Carte"
  }
}

// 추천 질문 템플릿
export const questionTemplates = {
  whenBuilt: {
    ko: "은 언제 지어졌고 어떤 의미를 가지나요?",
    ja: "はいつ建てられ、どのような意味を持っていますか？",
    en: " was built when and what meaning does it have?",
    zh: "是什么时候建造的，有什么意义？",
    es: " fue construido cuándo y qué significado tiene?",
    fr: " a été construit quand et quelle signification a-t-il ?"
  },
  architecture: {
    ko: "의 특별한 건축적 특징은 무엇인가요?",
    ja: "の特別な建築的特徴は何ですか？",
    en: "'s special architectural features are what?",
    zh: "的特殊建筑特色是什么？",
    es: " cuáles son sus características arquitectónicas especiales?",
    fr: " quelles sont ses caractéristiques architecturales spéciales ?"
  },
  importantPlace: {
    ko: "에서 가장 중요한 장소는 어디인가요?",
    ja: "で最も重要な場所はどこですか？",
    en: " where is the most important place?",
    zh: "最重要的地方在哪里？",
    es: " dónde está el lugar más importante?",
    fr: " où est l'endroit le plus important ?"
  },
  historicalFigures: {
    ko: "과 관련된 역사적 인물은 누구인가요?",
    ja: "に関連する歴史上の人物は誰ですか？",
    en: " who are the historical figures related to it?",
    zh: "相关的历史人物是谁？",
    es: " quiénes son las figuras históricas relacionadas?",
    fr: " qui sont les personnages historiques liés ?"
  },
  unique: {
    ko: "에서만 볼 수 있는 독특한 것이 있나요?",
    ja: "でしか見ることができない独特なものはありますか？",
    en: " is there something unique that can only be seen?",
    zh: "有什么独特的东西只能在这里看到吗？",
    es: " hay algo único que solo se puede ver?",
    fr: " y a-t-il quelque chose d'unique qui ne peut être vu que ?"
  },
  visitPoints: {
    ko: "을 방문할 때 꼭 봐야 할 포인트는요?",
    ja: "を訪問する際に必ず見るべきポイントは何ですか？",
    en: " what are the must-see points when visiting?",
    zh: "参观时必看的要点是什么？",
    es: " cuáles son los puntos que hay que ver al visitar?",
    fr: " quels sont les points à voir absolument lors de la visite ?"
  }
}