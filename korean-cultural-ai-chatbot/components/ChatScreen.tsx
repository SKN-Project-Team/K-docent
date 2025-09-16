import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Send, Mic, Globe, Users, Clock, Volume2, MapPin, MessageCircle } from "lucide-react"

// 타입 정의
interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  location?: string
  sources?: string[]
}

interface LocationData {
  name: { ko: string; en: string; ja: string; zh: string }
  category: { ko: string; en: string; ja: string; zh: string }
  distance: number
  backgroundImage: string
}

// 시연용 데이터
const demoLocation: LocationData = {
  name: { ko: "경복궁", en: "Gyeongbokgung Palace", ja: "景福宮", zh: "景福宫" },
  category: { ko: "궁궐", en: "Palace", ja: "宮殿", zh: "宫殿" },
  distance: 1.2,
  backgroundImage: "https://www.kh.or.kr/jnrepo/namo/img/images/000045/20230405103334542_MPZHA77B.jpg"
}

const demoUserProfile = {
  language: "ko",
  level: "intermediate",
  interests: ["history", "architecture"]
}

// 시연용 시나리오 데이터 - 타입 정의 추가
type DemoScenario = {
  response: string;
  sources: string[];
};

type DemoScenarios = {
  [key: string]: DemoScenario;
};

const demoScenarios: DemoScenarios = {
  '경복궁은 언제 지어졌나요?': {
    response: `경복궁은 1395년 조선 태조 이성계에 의해 건립된 조선 왕조의 정궁입니다.

🏛️ **건립 연도**: 1395년 (조선 태조 4년)
👑 **건립자**: 조선 태조 이성계
📍 **의미**: "큰 복을 빌어 왕과 백성이 함께 누린다"

경복궁은 조선 왕조 500년 역사의 중심지로, 현재 보시는 건물들은 대부분 1990년대 복원된 것입니다. 임진왜란으로 소실된 후 270여 년간 폐허로 남아있다가 고종 때 재건되었답니다.`,
    sources: ["문화재청", "한국관광공사", "궁궐문화재"]
  },
  '근정전의 건축 특징은 무엇인가요?': {
    response: `근정전은 경복궁의 정전(正殿)으로 조선 왕조의 위엄을 보여주는 대표적인 건축물입니다.

🏯 **건축적 특징**:
• **지붕**: 팔작지붕(우진각지붕) - 권위와 위엄 상징
• **기둥**: 24개의 원기둥으로 구성된 다포계 양식
• **월대**: 2층 석조 기단으로 격식과 위계 표현
• **용**: 천장의 용 조각 - 왕권의 상징

🎨 **장식 요소**:
• 단청(丹青): 청, 적, 황, 백, 흑의 오방색
• 창호: 꽃살문과 띠살문의 조화
• 박공: 용과 봉황 조각으로 장엄함 연출

현재 보시는 근정전은 1867년 재건된 후 1995년 복원된 것입니다.`,
    sources: ["문화재청", "한국전통건축학회", "궁궐복원연구소"]
  },
  '수문장 교대식은 언제 볼 수 있나요?': {
    response: `경복궁 수문장 교대식은 조선시대 궁궐 경비 의식을 재현한 인기 프로그램입니다!

⏰ **교대식 시간**:
• **평일**: 10:00, 13:00, 15:00 (3회)
• **주말**: 10:00, 11:00, 13:00, 14:00, 15:00 (5회)
• **소요시간**: 약 20분

📍 **장소**: 광화문 앞 광장
👥 **인원**: 수문장 8명, 취타대 6명

🎭 **볼거리**:
• 전통 갑옷과 무기 착용
• 조선시대 궁중음악 연주
• 엄숙한 의식 절차

⚠️ **주의사항**: 
• 우천 시 취소
• 매주 화요일 휴무
• 동절기(12-2월) 운영시간 단축

지금 시간에 맞춰 가시면 다음 교대식을 보실 수 있어요!`,
    sources: ["문화재청", "경복궁관리소", "한국문화재재단"]
  }
}

// 타이핑 인디케이터 컴포넌트
const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="max-w-[80%]">
      <div className="flex items-center gap-2 mb-2">
        <Avatar className="w-7 h-7 bg-gray-800 shadow-md">
          <AvatarFallback className="bg-gray-800 text-white text-xs font-bold">AI</AvatarFallback>
        </Avatar>
        <span className="text-xs font-medium text-gray-800">도슨트</span>
      </div>
      <Card className="bg-white border-gray-200 p-4 shadow-md">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </Card>
    </div>
  </div>
)

export default function ChatScreenDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '안녕하세요! 경복궁 AI 도슨트입니다. \n\n조선 왕조의 정궁 경복궁에 대해 무엇이든 물어보세요. 역사, 건축, 문화, 관람 정보까지 자세히 안내해드리겠습니다!',
      timestamp: new Date(),
      location: '경복궁',
      sources: ['문화재청', '한국관광공사', '궁궐문화재']
    }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [autoDemo, setAutoDemo] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // 장소별 맞춤 추천 질문
  const getSuggestedQuestions = () => {
    return [
      '경복궁의 숨겨진 이야기가 있나요?',
      '조선시대 왕의 하루 일과는?',
      '경복궁에서 가장 아름다운 곳은?',
      '궁궐 음식은 어떤 것들이 있었나요?',
      '경복궁 관람 팁을 알려주세요'
    ]
  }

  const handleSendMessage = (messageText?: string) => {
    const message = messageText || inputMessage.trim()
    if (!message) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
      location: '경복궁'
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // AI 응답 시뮬레이션
    setTimeout(() => {
      setIsTyping(false)
      
      // 정확한 질문 매칭을 위한 처리
      let matchedScenario: DemoScenario | null = null
      const normalizedMessage = message.trim()
      
      // 정확한 매칭 먼저 시도
      if (normalizedMessage in demoScenarios) {
        matchedScenario = demoScenarios[normalizedMessage]
      } else {
        // 키워드 기반 매칭
        if (normalizedMessage.includes('언제') && normalizedMessage.includes('지어')) {
          matchedScenario = demoScenarios['경복궁은 언제 지어졌나요?']
        } else if (normalizedMessage.includes('근정전') && normalizedMessage.includes('건축')) {
          matchedScenario = demoScenarios['근정전의 건축 특징은 무엇인가요?']
        } else if (normalizedMessage.includes('수문장') && normalizedMessage.includes('교대식')) {
          matchedScenario = demoScenarios['수문장 교대식은 언제 볼 수 있나요?']
        }
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: matchedScenario ? matchedScenario.response : `"${message}"에 대한 질문을 주셔서 감사합니다!\n\n경복궁에 대한 다양한 정보를 제공할 수 있습니다. 아래 질문들을 정확히 입력해보세요:\n\n• "경복궁은 언제 지어졌나요?"\n• "근정전의 건축 특징은 무엇인가요?"\n• "수문장 교대식은 언제 볼 수 있나요?"\n\n또는 위의 추천 질문 버튼을 클릭해주세요!`,
        timestamp: new Date(),
        location: '경복궁',
        sources: matchedScenario ? matchedScenario.sources : ['문화재청', '한국관광공사']
      }
      
      setMessages(prev => [...prev, aiMessage])
    }, 7000)
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question)
    handleSendMessage(question)
  }

  const handleVoiceInput = () => {
    setIsListening(!isListening)
  }

  // 자동 데모 실행
  const startAutoDemo = () => {
    if (autoDemo) return
    setAutoDemo(true)
    const questions = Object.keys(demoScenarios)
    let currentIndex = 0

    const askNextQuestion = () => {
      if (currentIndex < questions.length) {
        setTimeout(() => {
          handleSendMessage(questions[currentIndex])
          currentIndex++
          if (currentIndex < questions.length) {
            askNextQuestion()
          } else {
            setAutoDemo(false)
          }
        }, 6000)
      }
    }
    
    askNextQuestion()
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50" style={{ height: '100vh', minHeight: '-webkit-fill-available' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>

          {demoLocation?.backgroundImage && (
            <div
              aria-hidden
              className="w-10 h-10 rounded-full shadow-md overflow-hidden border-2 border-white flex-shrink-0"
              style={{
                backgroundImage: `url(${demoLocation.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}

          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-gray-900 truncate">
              {demoLocation?.name.ko} AI 도슨트
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-3 h-3" />
              <span>{demoLocation?.category.ko} • {demoLocation?.distance}km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Questions - 맨 위로 이동 */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-gray-700" />
          <span className="text-sm font-semibold text-gray-800">경복궁 추천 질문</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {getSuggestedQuestions().map((question, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-transparent text-gray-700"
              onClick={() => handleSuggestedQuestion(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages - 스크롤바 투명하게 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-4 duration-300`}>
            <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
              {message.type === "ai" && (
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-7 h-7 bg-gray-800 shadow-md">
                    <AvatarFallback className="bg-gray-800 text-white text-xs font-bold">AI</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-gray-800">도슨트</span>
                  {message.location && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                      <MapPin className="w-3 h-3 mr-1" />
                      {message.location}
                    </Badge>
                  )}
                </div>
              )}

              <Card
                className={`p-4 shadow-md ${
                  message.type === "user"
                    ? "bg-gray-900 text-white ml-auto border-gray-900"
                    : "bg-white border-gray-200"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>

                {message.sources && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                      <span className="font-medium">참고자료</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {message.sources.map((source, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-gray-200 text-gray-700">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {message.type === "ai" && (
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                    <Volume2 className="w-3 h-3 text-gray-600" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - 하단에 채팅박스 (네비게이션 바 회피) */}
      <div className="p-4 border-t bg-white" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="경복궁에 대해 궁금한 것을 물어보세요..."
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="pr-12 border-gray-200 focus:border-gray-400 bg-white"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
              onClick={handleVoiceInput}
            >
              <Mic className={`w-4 h-4 ${isListening ? "text-red-500" : "text-gray-600"}`} />
            </Button>
          </div>
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim()}
            className="bg-gray-900 hover:bg-gray-800 text-white shadow-md"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}