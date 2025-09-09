"use client"

import { useApp } from "@/context/AppContext"
import ChatScreen from "@/components/ChatScreen"
import { useRouter } from "next/navigation"

export default function ChatPage() {
  const router = useRouter()
  const { currentLocation, messages, setMessages, inputMessage, setInputMessage, isListening, setIsListening, userProfile } = useApp()

  const handleBackToDetail = () => {
    if (currentLocation) {
      router.push(`/detail/${currentLocation.name}`)
    } else {
      router.push("/")
    }
  }

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
      onBackToDetail={handleBackToDetail}
    />
  )
}