"use client"

import { useApp } from "@/context/AppContext"
import ChatScreen from "@/components/ChatScreen"
import { useRouter } from "next/navigation"

export default function ChatPage() {
  const router = useRouter()
  const {
    currentLocation,
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isListening,
    setIsListening,
    userProfile,
  } = useApp()

  return (
    <ChatScreen
      location={currentLocation}
      messages={messages}
      setMessages={setMessages}
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      isListening={isListening}
      setIsListening={setIsListening}
      userProfile={userProfile}
      onBackToDetail={() => router.push("/")}
      onGoHome={() => router.push("/")}
    />
  )
}
