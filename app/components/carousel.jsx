"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import axios from "axios"



export function Carousel({ slides , setIsSetAvatarModalOpen,setSlide ,Avatar}) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }
  
  const handleClick=(currslide)=>{
    setSlide(currslide);
    if(!Avatar.id){
      setIsSetAvatarModalOpen(true);
    }
  }
  
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-xl">
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div onClick={() => handleClick(slide)} key={index} className="w-full h-full flex-shrink-0 relative">
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-8 left-8 text-white">
                <div className="flex gap-2 mb-4">
                  {slide.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/20 text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
                <p className="text-white/80">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/40 transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/40 transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div className="absolute bottom-4 right-4 bg-white/20 px-3 py-1 rounded-full text-white text-sm">
        {currentSlide + 1}/{slides.length}
      </div>
    </div>
  )
}

