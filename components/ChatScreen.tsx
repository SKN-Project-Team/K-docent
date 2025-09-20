"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, Send, Mic, Volume2 } from "lucide-react"
import { AppHeader } from "@/components/Layout/AppHeader"
import { getTranslatedText } from "@/utils/translation"
import { useTranslation } from "@/utils/i18n"
import type { Message, LocationData } from "@/types"

const FALLBACK_LOCATION = {
  name: {
    ko: "경복궁",
    en: "Gyeongbokgung Palace",
    ja: "景福宮",
    zh: "景福宫",
    es: "Palacio Gyeongbok",
    fr: "Palais Gyeongbok",
  },
  category: {
    ko: "궁궐",
    en: "Palace",
    ja: "宮殿",
    zh: "宫殿",
    es: "Palacio",
    fr: "Palais",
  },
  distance: 1.2,
  backgroundImage: "https://www.kh.or.kr/jnrepo/namo/img/images/000045/20230405103334542_MPZHA77B.jpg",
}


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
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
      </Card>
    </div>
  </div>
)

interface ChatScreenProps {
  location: LocationData | null
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  inputMessage: string
  setInputMessage: (value: string) => void
  isListening: boolean
  setIsListening: (value: boolean) => void
  userProfile: {
    language: string
    level: string
    interests: string[]
  }
  onBackToDetail?: () => void
  onGoHome?: () => void
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
  onBackToDetail,
  onGoHome,
}: ChatScreenProps) {
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const language = userProfile?.language ?? "ko"
  const { t } = useTranslation(language)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleVoiceInput = () => {
    setIsListening(!isListening)
  }

  const handleSendMessage = async (messageText?: string) => {
    if (isTyping) return

    const message = (messageText ?? inputMessage).trim()
    if (!message) return

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    const aiMessageId = `${Date.now()}-ai`
    const aiMessage: Message = {
      id: aiMessageId,
      type: "ai",
      content: "",
      timestamp: new Date(),
    }

    const historyPayload = [...messages, userMessage]
      .slice(-6)
      .map((item) => ({
        role: item.type === "user" ? "user" : "assistant",
        content: item.content,
      }))

    setMessages((prev) => [...prev, userMessage, aiMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          language,
          location: null,
          history: historyPayload,
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error("Failed to stream response")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let done = false
      let buffer = ""
      let markerSeen = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading

        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          buffer += chunk

          if (!markerSeen && buffer.includes("\n[SOURCES]")) {
            markerSeen = true
          }

          let displayText = buffer
          let sources: string[] | null = null

          if (markerSeen) {
            const [textPart, sourcePartRaw = ""] = buffer.split("\n[SOURCES]")
            displayText = textPart
            sources = sourcePartRaw
              .split("|")
              .map((item) => item.trim())
              .filter(Boolean)
          }

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    content: displayText,
                    ...(sources ? { sources } : {}),
                  }
                : msg,
            ),
          )
        }
      }
    } catch (error) {
      console.error("Chat streaming error", error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content: "죄송합니다. 답변을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
                sources: ["시스템"],
              }
            : msg,
        ),
      )
    } finally {
      setIsTyping(false)
    }
  }


  return (
    <div
      className="flex flex-col h-screen bg-gray-50"
      style={{ height: "100vh", minHeight: "-webkit-fill-available" }}
    >
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <AppHeader
          className="bg-white"
          title={t('chat.aiDocent')}
          subtitle="문화재와 역사에 대해 질문해보세요"
          onBack={onBackToDetail}
          leadingContent={
            <div className="w-10 h-10 rounded-full shadow-md overflow-hidden border-2 border-gray-200 flex-shrink-0 bg-gray-800 flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
          }
          actions={[
            {
              key: "home",
              icon: <Home className="w-5 h-5 text-gray-600" />,
              onClick: () => onGoHome?.(),
              variant: "ghost",
              className: "p-2 rounded-full hover:bg-gray-100",
              ariaLabel: "홈으로 이동",
            },
          ]}
        />
      </div>


      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-4 duration-300`}
          >
            <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
              {message.type === "ai" && (
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-7 h-7 bg-gray-800 shadow-md">
                    <AvatarFallback className="bg-gray-800 text-white text-xs font-bold">AI</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-gray-800">도슨트</span>
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

                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                      <span className="font-medium">참고자료</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {message.sources.map((source) => (
                        <Badge key={source} variant="outline" className="text-xs border-gray-200 text-gray-700">
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

      <div className="p-4 border-t bg-white" style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t('chat.placeholder')}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="pr-12 border-gray-200 focus:border-gray-400 bg-white"
              disabled={isTyping}
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
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gray-900 hover:bg-gray-800 text-white shadow-md"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
