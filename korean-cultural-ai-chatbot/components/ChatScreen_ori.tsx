"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Send, Mic, Globe, Users, Clock, Volume2, MapPin, MessageCircle } from "lucide-react"
import { LocationData, Message } from "@/types"
import { getTranslatedText, uiTexts, questionTemplates } from "@/utils/translation"

interface ChatScreenProps {
  location: LocationData | null
  messages: Message[]
  setMessages: (messages: Message[]) => void
  inputMessage: string
  setInputMessage: (message: string) => void
  isListening: boolean
  setIsListening: (listening: boolean) => void
  userProfile: {
    language: string
    level: string
    interests: string[]
  }
  onBackToDetail: () => void
}

export default function ChatScreen({
  location,
  messages,
  setMessages,
  inputMessage,
  setInputMessage,
  isListening,
  setIsListening,
  userProfile,
  onBackToDetail
}: ChatScreenProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 장소별 맞춤 추천 질문
  const getSuggestedQuestions = () => {
    if (!location) return []
    
    const locationName = getTranslatedText(location.name, userProfile.language)
    return [
      `${locationName}${getTranslatedText(questionTemplates.whenBuilt, userProfile.language)}`,
      `${locationName}${getTranslatedText(questionTemplates.architecture, userProfile.language)}`,
      `${locationName}${getTranslatedText(questionTemplates.importantPlace, userProfile.language)}`,
      `${locationName}${getTranslatedText(questionTemplates.historicalFigures, userProfile.language)}`,
      `${locationName}${getTranslatedText(questionTemplates.unique, userProfile.language)}`,
      `${locationName}${getTranslatedText(questionTemplates.visitPoints, userProfile.language)}`,
    ]
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !location) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
      location: getTranslatedText(location.name, userProfile.language)
    }

    setMessages([...messages, userMessage])
    setInputMessage("")

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `${getTranslatedText(location.name, userProfile.language)}에 대한 질문 "${inputMessage.trim()}"에 대해 답변드리겠습니다. 이곳은 한국의 중요한 문화유산으로서 많은 역사와 의미를 담고 있습니다.`,
        timestamp: new Date(),
        location: getTranslatedText(location.name, userProfile.language),
        sources: ["문화재청", "한국관광공사", getTranslatedText(location.category, userProfile.language)]
      }
      setMessages([...messages, aiMessage])
    }, 1000)
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question)
  }

  const handleVoiceInput = () => {
    setIsListening(!isListening)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50" style={{ height: '100vh', minHeight: '-webkit-fill-available' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToDetail}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>

          {location?.backgroundImage && (
            <div
              aria-hidden
              className="w-10 h-10 rounded-full shadow-md overflow-hidden border-2 border-white flex-shrink-0"
              style={{
                backgroundImage: `url(${location.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}

          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-gray-900 truncate">
              {location ? getTranslatedText(location.name, userProfile.language) : ''} {getTranslatedText(uiTexts.aiGuide, userProfile.language)}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-3 h-3" />
              <span>{location ? getTranslatedText(location.category, userProfile.language) : ''} • {location?.distance}km</span>
            </div>
          </div>
        </div>
      </div>


      {/* Suggested Questions - 맨 위로 이동 */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-gray-700" />
          <span className="text-sm font-semibold text-gray-800">{location ? getTranslatedText(location.name, userProfile.language) : ''} {getTranslatedText(uiTexts.recommendedQuestions, userProfile.language)}</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {getSuggestedQuestions().slice(0, 3).map((question, idx) => (
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent hover:scrollbar-thumb-gray-300" style={{ paddingBottom: '6rem' }}>
        {messages.length === 0 ? (
          // 빈 채팅창 안내 메시지
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="mb-6">
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                안녕하세요! 👋<br/>
                {location ? getTranslatedText(location.name, userProfile.language) : ''}에 대해 궁금한 것이 있으시면<br/>
                뭐든 물어보세요!
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                {message.type === "ai" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-7 h-7 bg-gray-800 shadow-md">
                      <AvatarFallback className="bg-gray-800 text-white text-xs font-bold">AI</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-gray-800">{getTranslatedText(uiTexts.culturalGuide, userProfile.language)}</span>
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
                  <p className="text-sm leading-relaxed">{message.content}</p>

                  {message.sources && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                        <span className="font-medium">{getTranslatedText(uiTexts.references, userProfile.language)}</span>
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
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - 하단에 채팅박스 (네비게이션 바 회피) */}
      <div className="p-4 pb-6 border-t bg-white" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="질문을 입력하세요."
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
            onClick={handleSendMessage}
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