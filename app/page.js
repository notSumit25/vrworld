"use client";
import Image from "next/image";
import Canvas from "./components/Canvas";
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useEffect } from "react";

export default  function Home() {
  const { isSignedIn, user } = useAuth();
  
  const authenticate = async () => {
    const response = await axios.post('/api/User');
    console.log(response.data);
  };
  useEffect(() => {
    if (isSignedIn) {
      authenticate();
    }
  }, [isSignedIn]);

  return (
    <main className="max-h-screen w-full bg-white">
      <Canvas />
    </main>
      );
}
