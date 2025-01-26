"use client";
import { getSocket } from "../../../socket";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

export default function Page() {
  const { id } = useParams();
  const socket = getSocket();
  const canvasRef = useRef(null);
  const [user, setUser] = useState({
    x: 50,
    y: 50,
    id: socket.id,
    direction: "down",
    clerkId: null,
    name: null,
  });
  const [users, setUsers] = useState(new Map());
  const [direction, setDirection] = useState("down");
  const [map, setMap] = useState(null);
  const [roomUsers, setRoomUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoaded, isSignedIn, user: currUser } = useUser();
  const [spriteImage, setSpriteImage] = useState("");

  
  
  const fetchUsers = async () => {
    const res = await axios.post(`/api/Room/user`, { roomId: id });
    setRoomUsers(res.data.users);
    setMap(res.data.room.Map.image);
    console.log("Room users", res.data.users);
    console.log("Map", res.data.room.Map.image);
    const currUserSprite = res.data.users.find((u) => u.user.clerkId === currUser.id);
    console.log("Curr user", currUser.id);
    setUser({ ...user, clerkId: currUser.id, name: currUser.fullName });
    console.log("Curr user sprite", currUserSprite);
    if (currUserSprite) {
      setSpriteImage(currUserSprite.avatar.spiritImage);
    }
    setLoading(false); 
  };
  useEffect(() => {
    if(isLoaded && isSignedIn){
      socket.emit("joinSpace", id, user);
      console.log("Joining space", id);
      fetchUsers();
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    socket.on("updateUsers", (users) => {
      console.log("Updating users", users);
      setUsers(users);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const backgroundImg = new Image();
      backgroundImg.src = map;

      const spriteImg = new Image();
      console.log("Sprite image", spriteImage);
      spriteImg.src = spriteImage;

      const frameCount = 4;
      const spriteWidth = spriteImg.width / frameCount;
      const spriteHeight = spriteImg.height / 4;

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

        // Draw the current user
        const directionRow =
          direction === "down"
            ? 0
            : direction === "left"
            ? 1
            : direction === "right"
            ? 2
            : 3; // 'up'
        ctx.drawImage(
          spriteImg,
          0, // Always the first frame (x = 0)
          directionRow * spriteHeight, // Source y position
          spriteWidth, // Source width
          spriteHeight, // Source height
          user.x, // Destination x position
          user.y, // Destination y position
          50, // Destination width
          50 // Destination height
        );

        // Draw other users
        users.forEach((otherUser) => {
          if (otherUser.id !== socket.id) {
            const dir =
              otherUser.direction === "down"
                ? 0
                : otherUser.direction === "left"
                ? 1
                : otherUser.direction === "right"
                ? 2
                : 3; // 'up'
            ctx.drawImage(
              spriteImg,
              0, // Always the first frame (x = 0)
              dir * spriteHeight, // Source y position
              spriteWidth, // Source width
              spriteHeight, // Source height
              otherUser.x, // Destination x position
              otherUser.y, // Destination y position
              50, // Destination width
              50 // Destination height
            );
          }
        });

        requestAnimationFrame(draw);
      };

      const handleSpriteLoad = () => {
        draw();
      };

      spriteImg.onload = handleSpriteLoad;
    }
  }, [user, direction, users, loading, spriteImage]);

  const handleKeyDown = (e) => {
    const key = e.key;
    let newUser = { ...user };
    if (key === "w" || key === "ArrowUp") {
      newUser = { ...newUser, y: newUser.y - 20, direction: "up" };
    } else if (key === "s" || key === "ArrowDown") {
      newUser = { ...newUser, y: newUser.y + 20, direction: "down" };
    } else if (key === "a" || key === "ArrowLeft") {
      newUser = { ...newUser, x: newUser.x - 20, direction: "left" };
    } else if (key === "d" || key === "ArrowRight") {
      newUser = { ...newUser, x: newUser.x + 20, direction: "right" };
    }

    if (
      newUser.x !== user.x ||
      newUser.y !== user.y ||
      newUser.direction !== user.direction
    ) {
      setDirection(newUser.direction);
      setUser(newUser);
      socket.emit("updateAttributes", id, newUser);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      ) : (
        <canvas ref={canvasRef} className="w-full h-full" id="canvas"></canvas>
      )}
    </div>
  );
}
