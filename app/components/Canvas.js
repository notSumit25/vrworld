'use client'
import React, { useEffect } from "react";
export default function Canvas() {
  const canvasRef = React.useRef(null);
  const [user, setUser] = React.useState({x: 50, y: 50});
  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "black";
    context.lineWidth = 0.5; // Reduced stroke width
    for(let i = 0; i<canvas.width; i+=20){
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, canvas.height);
        context.stroke();
    }
    for(let i = 0; i<canvas.height; i+=20){
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(canvas.width, i);
        context.stroke();
    }
    if(user && user.x && user.y){
        context.beginPath();
        context.fillStyle = "red";
        context.arc(user.x, user.y, 10, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = "black";
        context.font = "10px Arial";
        context.textAlign = "center";
        context.fillText("User", user.x + 5, user.y, 5, 5);
    }
  }, [user]); // Add user to dependency array

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
    <div className="max-h-screen w-full bg-white">
      <canvas ref={canvasRef} id="canvas" style={{height: "100vh", width: "100vw"}} width={1920} height={1080}></canvas>
    </div>
  );
}
