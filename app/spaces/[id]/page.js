'use client'
import React, { useEffect } from 'react'

export default function page() {
    const ref = React.useRef(null)
      const [user, setUser] = React.useState({x: 50, y: 50});
    useEffect(() => {
        const canvas = ref.current
        const ctx = canvas.getContext('2d')
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        //set image as background on canvas
        const img = new Image()
        img.src = '/background.webp'
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
        if(user && user.x && user.y){
            const userImg = new Image()
            userImg.src = '/player.png'
            userImg.onload = () => {
                ctx.drawImage(userImg, user.x, user.y, 50, 50)
            }
        }

    }, [user])

    const handle = (e) => {
        if(!user) return;
        const key = e.key;
        //use WASD
        if(key === "w" || key === "ArrowUp"){
          setUser({...user, y: user.y - 20});
        } else if(key === "s" || key === "ArrowDown"){
          setUser({...user, y: user.y + 20});
        } else if(key === "a" || key === "ArrowLeft"){
          setUser({...user, x: user.x - 20});
        } else if(key === "d" || key === "ArrowRight"){
          setUser({...user, x: user.x + 20});
        }
      }
    
      useEffect(() => {
        window.addEventListener("keydown", handle);
        return () => window.removeEventListener("keydown", handle);
      }, [user]);
  return (
    <div className='min-h-screen bg-gray-50 w-full'>
      <canvas ref={ref} className='w-full h-full' id='canvas'></canvas>
    </div>
  )
}
