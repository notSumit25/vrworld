"use client"

import { useState } from "react"
import { Menu, X, Send, ChartAreaIcon, MessageCircle } from "lucide-react"

export default function HamburgerChat({ messages, sendMessage }) {
  const [isOpen, setIsOpen] = useState(false)
  const [newMessage, setNewMessage] = useState("")

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      sendMessage(newMessage)
      setNewMessage("")
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-end p-4 pointer-events-none z-50 ">
      <button
        onClick={toggleChat}
        className="text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-full focus:outline-none z-50 pointer-events-auto"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <div
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out pointer-events-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Chat</h2>
          <button onClick={toggleChat} className="text-gray-600 hover:text-gray-800">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-8rem)]">
          {messages.map((msg, index) => (
            <div key={index} className="flex flex-col">
              <p className="text-sm font-semibold">{msg.user}</p>
              <p className="bg-gray-100 rounded-lg p-2 mt-1">{msg.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="p-2 text-blue-500 hover:text-blue-600 focus:outline-none">
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

