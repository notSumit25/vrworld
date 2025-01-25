"use client";

import { use, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Carousel } from "../components/carousel";
import { Modal } from "../components/modal";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { CreateSpaceModal } from "../components/Modal2";
import axios from "axios";
import { generateReactHelpers } from "@uploadthing/react";

// import { OurFileRouter } from "@/app/api/uploadthing/core";

const slides = [
  {
    title: "ZEP Boxing",
    description: "Defeat other players and become the champion!",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MIIRKzcy4QnfPXa4MC0c1qDhzY178Y.png",
    tags: ["Official", "Game"],
  },
  {
    title: "ZEP Study room",
    description: "Study alone or with friends in our new study room!",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MIIRKzcy4QnfPXa4MC0c1qDhzY178Y.png",
    tags: ["Official", "Gathering"],
  },
  {
    title: "Bonbon School Detectives",
    description: "Uncover the truth behind the missing students",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MIIRKzcy4QnfPXa4MC0c1qDhzY178Y.png",
    tags: ["Official", "Game"],
  },
];

export default function Home() {
  const [isEnterCodeModalOpen, setIsEnterCodeModalOpen] = useState(false);
  const [isCreateSpaceModalOpen, setIsCreateSpaceModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const { useUploadThing } = generateReactHelpers();
  const { startUpload } = useUploadThing("imageUploader");
  const [roomId, setroomId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [userrooms, setUserRooms] = useState([]);
  const [recent, setRecent] = useState(true);

  const imageOptions = [
    "/placeholder.svg?height=100&width=100&text=Image1",
    "/placeholder.svg?height=100&width=100&text=Image2",
    "/placeholder.svg?height=100&width=100&text=Image3",
    "/placeholder.svg?height=100&width=100&text=Image4",
  ];

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const response = await axios.get("/api/Room");
    console.log(response.data);
    setRooms(response.data.rooms);
    setUserRooms(response.data.userrooms);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      const uploadedFiles = await startUpload([file]);
      if (uploadedFiles && uploadedFiles.length > 0) {
        const uploadedUrl = uploadedFiles[0].url;
        setUploadedImage(uploadedUrl);
        console.log("Uploaded image URL:", uploadedUrl);
      }
    }
  };

  const joinRoom = async () => {
    const response = await axios.put("/api/Room", { roomId });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-12"></div>
        <div className="flex items-center gap-4">
          <Link
            href={"/spaces"}
            className="px-6 py-2 text- bg-transparent rounded-full border-2 border-[#00B37D] hover:bg-[#00B37D] hover:text-white transition-colors"
          >
            Explore Worlds
          </Link>
          <UserButton />
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Carousel slides={slides} />

        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-4">
            <button
              className={
                recent
                  ? `font-medium text-gray-900`
                  : "text-gray-500 hover:text-gray-700"
              }
              onClick={() => setRecent(true)}
            >
              Recent
            </button>
            <button
              className={
                !recent
                  ? `font-medium text-gray-900`
                  : "text-gray-500 hover:text-gray-700"
              }
              onClick={() => setRecent(false)}
            >
              My Spaces
            </button>
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

        <Modal
          isOpen={isEnterCodeModalOpen}
          onClose={() => setIsEnterCodeModalOpen(false)}
          title="Enter with Code"
        >
          <input
            type="text"
            value={roomId}
            onChange={(e) => setroomId(e.target.value)}
            placeholder="Enter space code"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={joinRoom}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Enter Space
          </button>
        </Modal>
        <CreateSpaceModal
          isOpen={isCreateSpaceModalOpen}
          onClose={() => setIsCreateSpaceModalOpen(false)}
        />
        {recent &&
          rooms.map((ele) => (
            <button
              key={ele.id}
              type="button"
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all border-gray-200 hover:border-gray-300`}
            >
              <img
                src={ele.Map.image}
                alt="roomsInage"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/50 p-2">
                <p className="text-white text-sm text-center">{ele.name}</p>
              </div>
            </button>
          ))}
        {!recent &&
          userrooms.map((ele) => (
            <button
              key={ele.id}
              type="button"
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all border-gray-200 hover:border-gray-300`}
            >
              <img
                src={ele.Map.image}
                alt="roomsInage"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/50 p-2">
                <p className="text-white text-sm text-center">{ele.name}</p>
              </div>
            </button>
          ))}
      </main>
    </div>
  );
}
