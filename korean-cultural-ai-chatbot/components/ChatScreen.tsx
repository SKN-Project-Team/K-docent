"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Send, Mic, Globe, Users, Clock, Volume2, MapPin } from "lucide-react"
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
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question)
  }

  const handleVoiceInput = () => {
    setIsListening(!isListening)
  }

  return (
    <div className="flex flex-col h-screen bg-background korean-pattern">
      {/* Header - 장소 정보 강조 */}
      <div className="flex items-center justify-between p-4 border-b bg-card dancheong-accent">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToDetail}
            className="p-2 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 text-primary" />
          </Button>
          {location?.backgroundImage ? (
            <div 
              className="w-12 h-12 rounded-full shadow-lg overflow-hidden"
              style={{
                backgroundImage: `url(${location.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          ) : (
            <Avatar className="w-12 h-12 bg-primary shadow-lg">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                🏛️
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            <h1 className="font-bold text-lg text-primary">{location ? getTranslatedText(location.name, userProfile.language) : ''} {getTranslatedText(uiTexts.aiGuide, userProfile.language)}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{location ? getTranslatedText(location.category, userProfile.language) : ''} • {location?.distance}km</span>
            </div>
          </div>
        </div>
      </div>

      {/* 장소 컨텍스트 정보 */}
      <div className="p-3 bg-primary/5 border-b">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-xs">{location?.illustration}</span>
          </div>
          <span className="text-sm font-medium text-primary">
            {getTranslatedText(uiTexts.askEverything, userProfile.language)} {location ? getTranslatedText(location.name, userProfile.language) : ''}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {location ? getTranslatedText(location.description, userProfile.language) : ''}
        </p>
      </div>

      {/* User Profile Controls - 간소화 */}
      <div className="p-3 bg-muted/30 border-b cloud-pattern">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{getTranslatedText(uiTexts.levelLabel, userProfile.language)}</span>
          </div>
          <div className="flex gap-2">
            {[
              { key: "expert", label: getTranslatedText(uiTexts.expert, userProfile.language), icon: "🎓" },
              { key: "adult", label: getTranslatedText(uiTexts.adult, userProfile.language), icon: "👤" },
              { key: "children", label: getTranslatedText(uiTexts.children, userProfile.language), icon: "🧒" },
            ].map((level) => (
              <Button
                key={level.key}
                variant={userProfile.level === level.key ? "default" : "outline"}
                size="sm"
                className={`text-xs ${
                  userProfile.level === level.key
                    ? "bg-primary text-primary-foreground"
                    : "border-primary/20 hover:border-primary/40"
                }`}
              >
                {level.icon} {level.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
              {message.type === "ai" && (
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-7 h-7 bg-primary shadow-md">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">AI</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-primary">{getTranslatedText(uiTexts.culturalGuide, userProfile.language)}</span>
                  {message.location && (
                    <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {message.location}
                    </Badge>
                  )}
                </div>
              )}

              <Card
                className={`p-4 shadow-md ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground ml-auto border-primary"
                    : "bg-card/90 backdrop-blur-sm border-primary/10"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>

                {message.sources && (
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <span className="font-medium">{getTranslatedText(uiTexts.references, userProfile.language)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {message.sources.map((source, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-primary/20 text-primary">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {message.type === "ai" && (
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-primary/10">
                    <Volume2 className="w-3 h-3 text-primary" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions - 장소별 맞춤형 */}
      <div className="p-4 border-t bg-muted/20 cloud-pattern">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">{location ? getTranslatedText(location.name, userProfile.language) : ''} {getTranslatedText(uiTexts.recommendedQuestions, userProfile.language)}</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {getSuggestedQuestions().slice(0, 3).map((question, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs border-primary/20 hover:border-primary/40 hover:bg-primary/5 bg-transparent"
              onClick={() => handleSuggestedQuestion(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>

      {/* Input - 장소별 맞춤형 플레이스홀더 */}
      <div className="p-4 border-t bg-card/80 backdrop-blur-sm dancheong-accent">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`${location ? getTranslatedText(location.name, userProfile.language) : ''}${getTranslatedText(uiTexts.chatPlaceholder, userProfile.language)}`}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="pr-12 border-primary/20 focus:border-primary/40 bg-background/90"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-primary/10"
              onClick={handleVoiceInput}
            >
              <Mic className={`w-4 h-4 ${isListening ? "text-destructive" : "text-primary"}`} />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}