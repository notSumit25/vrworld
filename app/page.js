"use client";
import Image from "next/image";
import Canvas from "./components/Canvas";
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default  function Home() {
  const { isSignedIn, user } = useAuth();
  
  const authenticate = async () => {
    const response = await axios.post('/api/User');
    // console.log(response.data);
  };
  useEffect(() => {
    if (isSignedIn) {
      authenticate();
    }
  }, [isSignedIn]);



  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400 text-white px-20">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-12"></div>

        <div className="flex items-center gap-4">
          <button className="px-6 py-2 text- bg-transparent rounded-full border-2 border-[#00B37D] hover:bg-[#00B37D] hover:text-white transition-colors">
            Explore Worlds
          </button>
          <UserButton />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-20 pb-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold leading-tight">
              Your Virtual HQ
            </h1>
            <p className="text-xl text-gray-300">
              Gather brings the best of in-person collaboration to distributed
              teams.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <button className="px-6 py-3 bg-[#00B37D] text-white rounded-full hover:bg-[#00A070] transition-colors">
                Join the Global World
              </button>
              <button className="px-6 py-3 text-white flex items-center gap-2 hover:bg-white/10 rounded-full transition-colors">
                Build your own world 
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-[#2A2F45] rounded-lg overflow-hidden shadow-2xl">
              <video
                className=" aspect-video"
                autoPlay
                muted
                loop
                src="https://cdn.vidzflow.com/v/h3yy6rTnJQ_720p_1691443174.mp4"
              ></video>
            </div>
          </div>
        </div>
      </div>

      {/* Language Selector */}
    </div>
  );
}
