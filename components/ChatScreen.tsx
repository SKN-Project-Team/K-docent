"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, Send, Mic, Volume2 } from "lucide-react"
import { AppHeader } from "@/components/Layout/AppHeader"
import { useTranslation } from "@/utils/i18n"
import type { Message, LocationData } from "@/types"
import type { ChatResponse } from "@/lib/api/types"

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000").replace(/\/$/, "")
const CHAT_ENDPOINT = `${API_BASE_URL}/api/v1/chat`

const resolveLocationName = (location: LocationData | null, language: string) => {
  if (!location) return null
  const localized = location.name?.[language as keyof typeof location.name]
  const fallback = location.name?.ko
  const resolved = typeof localized === "string" && localized.trim() ? localized : fallback
  return resolved?.trim() || null
}

const resolveLanguageCode = (value?: string) => {
  if (!value) return "ko"
  const normalized = value.trim().toLowerCase()
  return normalized || "ko"
}

const resolveAgeGroup = (level?: string) => {
  if (!level) return "adult"
  const normalized = level.trim().toLowerCase()
  if (normalized === "children" || normalized === "child") return "child"
  return "adult"
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
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const language = userProfile?.language ?? "ko"
  const { t } = useTranslation(language)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    setSessionId(null)
  }, [location])

  const handleVoiceInput = () => {
    setIsListening(!isListening)
  }

  const handleSendMessage = async (messageText?: string) => {
    if (isTyping) return

    const text = (messageText ?? inputMessage).trim()
    if (!text) return

    const locationName = resolveLocationName(location, language)

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      type: "user",
      content: text,
      timestamp: new Date(),
      ...(locationName ? { location: locationName } : {}),
    }

    const aiMessageId = `${Date.now()}-ai`

    const upsertAiMessage = (content: string, extra?: Partial<Message>) => {
      setMessages((prev) => {
        const existingIndex = prev.findIndex((msg) => msg.id === aiMessageId)

        if (existingIndex >= 0) {
          return prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  content,
                  ...(extra ?? {}),
                  timestamp: extra?.timestamp ?? msg.timestamp,
                }
              : msg,
          )
        }

        const newMessage: Message = {
          id: aiMessageId,
          type: "ai",
          content,
          timestamp: extra?.timestamp ?? new Date(),
          ...(locationName ? { location: locationName } : {}),
          ...(extra ?? {}),
        }

        return [...prev, newMessage]
      })
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      const payload = {
        message: text,
        language: resolveLanguageCode(language),
        age_group: resolveAgeGroup(userProfile?.level),
        ...(sessionId ? { session_id: sessionId } : {}),
      }

      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        let errorMessage = `Failed to fetch response: ${response.status}`
        try {
          const errorBody = await response.json()
          if (typeof errorBody?.detail === "string" && errorBody.detail.trim()) {
            errorMessage = errorBody.detail.trim()
          }
        } catch {
          // ignore json parse errors
        }
        throw new Error(errorMessage)
      }

      const contentType = response.headers.get("content-type") ?? ""

      if (contentType.includes("application/json")) {
        const data = (await response.json()) as ChatResponse
        const assistantText =
          data?.assistant_response?.trim() ?? data?.response?.trim() ?? ""
        const responseTimestamp = data?.created_at ? new Date(data.created_at) : new Date()
        const normalizedSources = Array.isArray(data?.sources)
          ? data.sources.filter((source): source is string => typeof source === "string" && Boolean(source.trim()))
          : undefined
        const sessionIdentifier = (data?.session_id ?? data?.conversation_id)?.trim()

        if (sessionIdentifier) {
          setSessionId(sessionIdentifier)
        }

        upsertAiMessage(assistantText || "죄송합니다. 답변을 가져오지 못했어요.", {
          timestamp: responseTimestamp,
          ...(normalizedSources ? { sources: normalizedSources } : {}),
        })
        return
      }

      const headerSessionId = response.headers.get("x-session-id")?.trim()
      if (headerSessionId) {
        setSessionId(headerSessionId)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("Response body is empty")
      }

      const decoder = new TextDecoder()
      let buffer = ""
      let done = false
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
          let sources: string[] | undefined

          if (markerSeen) {
            const [textPart, sourcePartRaw = ""] = buffer.split("\n[SOURCES]")
            displayText = textPart
            sources = sourcePartRaw
              .split("|")
              .map((item) => item.trim())
              .filter(Boolean)
            if (!sources.length) {
              sources = undefined
            }
          }

          upsertAiMessage(displayText, {
            ...(sources ? { sources } : {}),
          })
        }
      }

      let finalText = buffer
      let finalSources: string[] | undefined

      if (markerSeen) {
        const [textPart, sourcePartRaw = ""] = buffer.split("\n[SOURCES]")
        finalText = textPart
        finalSources = sourcePartRaw
          .split("|")
          .map((item) => item.trim())
          .filter(Boolean)
        if (!finalSources.length) {
          finalSources = undefined
        }
      }

      upsertAiMessage(finalText.trim() || "죄송합니다. 답변을 가져오지 못했어요.", {
        timestamp: new Date(),
        ...(finalSources ? { sources: finalSources } : {}),
      })
    } catch (error) {
      console.error("Chat response error", error)
      upsertAiMessage(
        error instanceof Error
          ? error.message
          : "죄송합니다. 답변을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        {
          timestamp: new Date(),
          sources: ["시스템"],
        },
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
          // leadingContent={
          //   <div className="w-10 h-10 rounded-full shadow-md overflow-hidden border-2 border-gray-200 flex-shrink-0 bg-gray-800 flex items-center justify-center">
          //     <span className="text-white text-sm font-bold">AI</span>
          //   </div>
          // }
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
        {messages.map((message) => {
          return (
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
          )
        })}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}>
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
