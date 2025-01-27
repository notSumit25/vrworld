"use client"
import { getSocket } from "../../../socket"
import React, { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import LiveRoom from "../../components/LiveRoom"
import { useUser } from "@clerk/nextjs"
import HamburgerChat from "../../components/HamburgerChat.jsx"

export default function Page() {
  const { id } = useParams()
  const socket = getSocket()
  const canvasRef = useRef(null)
  const [user, setUser] = useState({
    x: 50,
    y: 50,
    id: socket.id,
    direction: "down",
    clerkId: null,
    name: null,
    spiritImage: null,
    avatarName: null,
  })
  const [users, setUsers] = useState(new Map())
  const [direction, setDirection] = useState("down")
  const [map, setMap] = useState(null)
  const [roomUsers, setRoomUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { isLoaded, isSignedIn, user: currUser } = useUser()
  const [spriteImage, setSpriteImage] = useState("")
  const [messages, setMessages] = useState([])
  const [canvas,setCanvas]=useState(null);
  //const [newMessage, setNewMessage] = useState(""); //Removed as per update 4
  const usersmap = new Map()

  const fetchUsers = async () => {
    const res = await axios.post(`/api/Room/user`, { roomId: id })
    setRoomUsers(res.data.users)
    setMap(res.data.room.Map.image)
    const currUserSprite = res.data.users.find((u) => u.user.clerkId === currUser.id)

    setUser({
      ...user,
      clerkId: currUserSprite.user.clerkId,
      name: currUserSprite.user.name,
      spiritImage: currUserSprite.avatar.spiritImage,
      avatarName: currUserSprite.avatar.name,
    })

    if (currUserSprite) {
      setSpriteImage(currUserSprite.avatar.spiritImage)
      console.log("Sprite image", spriteImage)
    }
    setLoading(false)
  }
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      socket.emit("joinSpace", id, user)
      console.log("Joining space", id)
      fetchUsers()
    }
  }, [isLoaded, isSignedIn])

  useEffect(() => {
    socket.on("updateUsers", (users) => {
      console.log("Updating users", users)
      console.log(users)
      setUsers(users)
    })
    const handleIncomingMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    }

    socket.on("message", handleIncomingMessage)
    return () => {
      socket.off("message", handleIncomingMessage)
    }
  }, [])

  useEffect(() => {
    if (!loading) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setCanvas(canvas);

      const backgroundImg = new Image()
      backgroundImg.src = map

      const spriteImg = new Image()
      console.log("Sprite image", spriteImage)
      spriteImg.src = spriteImage

      const frameCount = 4
      const spriteWidth = spriteImg.width / frameCount
      const spriteHeight = spriteImg.height / 4

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height)


        const maxX = canvas.width - 50  // 50 is the width of the sprite
        const maxY = canvas.height - 50 // 50 is the height of the sprite
  
        // Apply boundary constraints to user position
        const userX = Math.max(0, Math.min(user.x, maxX))
        const userY = Math.max(0, Math.min(user.y, maxY))
        // Draw the current user
        const directionRow = direction === "down" ? 0 : direction === "left" ? 1 : direction === "right" ? 2 : 3 // 'up'
        

        // Draw other users
        users.forEach((otherUser) => {
          const otherspiritImage = new Image()
          otherspiritImage.src = otherUser.spiritImage
            const dir =
              otherUser.direction === "down"
                ? 0
                : otherUser.direction === "left"
                  ? 1
                  : otherUser.direction === "right"
                    ? 2
                    : 3 // 'up'
            ctx.drawImage(
              otherspiritImage,
              0, // Always the first frame (x = 0)
              dir * spriteHeight, // Source y position
              spriteWidth, // Source width
              spriteHeight, // Source height
              otherUser.x, // Destination x position
              otherUser.y, // Destination y position
              50, // Destination width
              50, // Destination height
            )
        })

        requestAnimationFrame(draw)
      }

      const handleSpriteLoad = () => {
        draw()
      }

      spriteImg.onload = handleSpriteLoad
    }
  }, [user, direction, users, loading, spriteImage])

  const sendMessage = (message) => {
    console.log("Sending message", message, user.name)
    socket.emit("message", { text: message, user: user.name }, id)
    setMessages((prevMessages) => [...prevMessages, { text: message, user: user.name }])
  }

  const handleKeyDown = (e) => {
    const key = e.key
    let newUser = { ...user }
    if (key === "w" || key === "ArrowUp") {
      newUser = { ...newUser, y: newUser.y - 20, direction: "up" }
    } else if (key === "s" || key === "ArrowDown") {
      newUser = { ...newUser, y: newUser.y + 20, direction: "down" }
    } else if (key === "a" || key === "ArrowLeft") {
      newUser = { ...newUser, x: newUser.x - 20, direction: "left" }
    } else if (key === "d" || key === "ArrowRight") {
      newUser = { ...newUser, x: newUser.x + 20, direction: "right" }
    }
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const maxX = canvas.width 
    const maxY = canvas.height 
    const userX = Math.max(0, Math.min(newUser.x, maxX))
    const userY = Math.max(0, Math.min(newUser.y, maxY))
    newUser.x = userX
    newUser.y = userY
    if (userX !== user.x || userY !== user.y || newUser.direction !== user.direction) {
      setDirection(newUser.direction)
      setUser(newUser)
      socket.emit("updateAttributes", id, newUser)
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [user])

  if (!isLoaded || !isSignedIn) {
    return null
  }
  return (
    <div className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <canvas ref={canvasRef} className="h-full w-full" id="canvas"></canvas>
          <HamburgerChat messages={messages} sendMessage={sendMessage} />
          <LiveRoom roomId={id} userName={user.name} />
        </>
      )}
    </div>
  )
}

