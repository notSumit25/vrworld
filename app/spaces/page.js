"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Carousel } from "../components/carousel"
import { Modal } from "../components/modal"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

const slides = [
  {
    title: "ZEP Boxing",
    description: "Defeat other players and become the champion!",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MIIRKzcy4QnfPXa4MC0c1qDhzY178Y.png",
    tags: ["Official", "Game"],
  },
  {
    title: "ZEP Study room",
    description: "Study alone or with friends in our new study room!",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MIIRKzcy4QnfPXa4MC0c1qDhzY178Y.png",
    tags: ["Official", "Gathering"],
  },
  {
    title: "Bonbon School Detectives",
    description: "Uncover the truth behind the missing students",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MIIRKzcy4QnfPXa4MC0c1qDhzY178Y.png",
    tags: ["Official", "Game"],
  },
]

export default function Home() {
  const [isEnterCodeModalOpen, setIsEnterCodeModalOpen] = useState(false)
  const [isCreateSpaceModalOpen, setIsCreateSpaceModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
        <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-12"></div>
        <div className="flex items-center gap-4">
          <Link href={'/spaces'} className="px-6 py-2 text- bg-transparent rounded-full border-2 border-[#00B37D] hover:bg-[#00B37D] hover:text-white transition-colors">
            Explore Worlds
          </Link>
          <UserButton />
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Carousel slides={slides} />

        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-4">
            <button className="font-medium text-gray-900">Recent</button>
            <button className="text-gray-500 hover:text-gray-700">My Spaces</button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Spaces"
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-[300px]"
              />
            </div>
            <button
              onClick={() => setIsEnterCodeModalOpen(true)}
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
            >
              Enter with Code
            </button>
            <button
              onClick={() => setIsCreateSpaceModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Create Space
            </button>
          </div>
        </div>

        <Modal isOpen={isEnterCodeModalOpen} onClose={() => setIsEnterCodeModalOpen(false)} title="Enter with Code">
          <input
            type="text"
            placeholder="Enter space code"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium">
            Enter Space
          </button>
        </Modal>

        <Modal
          isOpen={isCreateSpaceModalOpen}
          onClose={() => setIsCreateSpaceModalOpen(false)}
          title="Create New Space"
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Space name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option>Select template</option>
              <option>Empty Space</option>
              <option>Game Template</option>
              <option>Meeting Room</option>
            </select>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium">
              Create Space
            </button>
          </div>
        </Modal>
      </main>
    </div>
  )
}

