"use client"

import { useApp } from "@/context/AppContext"
import ChatScreen from "@/components/ChatScreen"
import { useRouter } from "next/navigation"
import { getTranslatedText } from "@/utils/translation"

export default function ChatPage() {
  const router = useRouter()
  const { messages, setMessages, inputMessage, setInputMessage, isListening, setIsListening, userProfile } = useApp()

  return (
    <ChatScreen
      location={null}
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
