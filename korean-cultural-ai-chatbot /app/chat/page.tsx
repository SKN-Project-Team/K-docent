"use client"

import { useApp } from "@/context/AppContext"
import ChatScreen from "@/components/ChatScreen"
import { useRouter } from "next/navigation"
import { getTranslatedText } from "@/utils/translation"

export default function ChatPage() {
  const router = useRouter()
  const { currentLocation, messages, setMessages, inputMessage, setInputMessage, isListening, setIsListening, userProfile } = useApp()

  const handleBackToDetail = () => {
    if (currentLocation) {
      const locationName = getTranslatedText(currentLocation.name, userProfile.language)
      router.push(`/detail/${encodeURIComponent(locationName)}`)
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