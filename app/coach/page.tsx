"use client"

import { useState, useRef, useEffect } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader, RotateCcw } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your WasteWise AI Coach. I'm here to help you reduce waste and build sustainable habits. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const suggestedPrompts = [
    "How can I reduce plastic waste?",
    "Meal planning tips to reduce food waste",
    "Best composting methods for my home",
    "Calculate savings from waste reduction",
  ]

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: data.response,
          timestamp: new Date(data.timestamp),
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "I'm having trouble connecting. Please check your connection and try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setMessages([
      {
        id: "1",
        type: "ai",
        content:
          "Hello! I'm your WasteWise AI Coach. I'm here to help you reduce waste and build sustainable habits. How can I assist you today?",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Stats and Achievements */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20 space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-4">Your Stats</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Waste Reduced</p>
                    <p className="text-2xl font-bold text-primary">23%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Days Active</p>
                    <p className="text-2xl font-bold">42</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Saved</p>
                    <p className="text-2xl font-bold text-green-600">₹2,840</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Achievements</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌱</span>
                    <span className="text-sm">Eco Starter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">♻️</span>
                    <span className="text-sm">Recycling Champ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💚</span>
                    <span className="text-sm">Green Warrior</span>
                  </div>
                </div>
              </div>

              <Button size="sm" variant="outline" onClick={handleReset} className="w-full bg-transparent">
                <RotateCcw className="h-3 w-3 mr-2" />
                New Chat
              </Button>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="flex flex-col h-screen max-h-[600px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground px-4 py-3 rounded-lg rounded-bl-none">
                      <Loader className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Prompts */}
              {messages.length <= 1 && (
                <div className="px-6 py-4 border-t">
                  <p className="text-xs text-muted-foreground mb-3">Try asking:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestedPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(prompt)}
                        disabled={isLoading}
                        className="text-xs p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-left disabled:opacity-50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask your question..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !isLoading) {
                        handleSendMessage(inputValue)
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={isLoading || !inputValue.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
