"use client";
import { getSocket } from "../../../socket";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  const socket = getSocket();
  const canvasRef = useRef(null);
  const [user, setUser] = useState({
    x: 50,
    y: 50,
    id: socket.id,
    direction: "down",
  });
  const [users, setUsers] = useState(new Map());
  const [direction, setDirection] = useState("down");

  useEffect(() => {
    socket.emit("joinSpace", id, user);
    console.log("Joining space", id);
  }, []);

  useEffect(() => {
    socket.on("updateUsers", (users) => {
      console.log("Updating users", users);
      setUsers(users);
    });
  }, [user, direction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const backgroundImg = new Image();
    backgroundImg.src = "/background.webp";

    const spriteImg = new Image();
    spriteImg.src = "/sprite.png";

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
    socket.emit("updateAttributes", id, user);
  }, [user, direction, users]);

  const handleKeyDown = (e) => {
    const key = e.key;
    if (key === "w" || key === "ArrowUp") {
      setDirection("up");
      setUser((prev) => ({ ...prev, y: prev.y - 20, direction: "up" }));
    } else if (key === "s" || key === "ArrowDown") {
      setDirection("down");
      setUser((prev) => ({ ...prev, y: prev.y + 20, direction: "down" }));
    } else if (key === "a" || key === "ArrowLeft") {
      setDirection("left");
      setUser((prev) => ({ ...prev, x: prev.x - 20, direction: "left" }));
    } else if (key === "d" || key === "ArrowRight") {
      setDirection("right");
      setUser((prev) => ({ ...prev, x: prev.x + 20, direction: "right" }));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <canvas ref={canvasRef} className="w-full h-full" id="canvas"></canvas>
    </div>
  );
}
