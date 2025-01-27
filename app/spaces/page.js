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
import { useRouter } from "next/navigation";
import Image from "next/image";
import { title } from "process";


const slides = [
  {
    roomId:"64ca7a31-115e-41da-afc3-e34c2eef7262",
    title: "ZEP Boxing",
    description: "Defeat other players and become the champion!",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MIIRKzcy4QnfPXa4MC0c1qDhzY178Y.png",
    tags: ["Official", "Game"],
  },
  {
    roomId:"f246b001-6082-4329-a447-d8d7f612ae8e",
    title: "ZEP Study room",
    description: "Study alone or with friends in our new study room!",
    image:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MIIRKzcy4QnfPXa4MC0c1qDhzY178Y.png",
    tags: ["Official", "Gathering"],
  },
  {
    roomId:"8f58f78d-d4ce-49ce-b79d-f39fda23df5b",
    title: "Bonbon School Detectives",
    description: "Uncover the truth behind the missing students",
    image:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MIIRKzcy4QnfPXa4MC0c1qDhzY178Y.png",
    tags: ["Official", "Game"],
  },
  {
    roomId: "3cc618fc-5a79-4f88-9bd1-bab42beebb26",
    title: "ZEP Tournament",
    description: "Join the tournament and win amazing prizes!",
    image:"https://6zbrwlnqfb.ufs.sh/f/ZiOcTFqmdHkJVtSINJbUFRyn97d6iOMz8wlAm1eTo5YLfIHk",
    tags: ["Official", "Event"],
  }
];

export default function Home() {
  const [isEnterCodeModalOpen, setIsEnterCodeModalOpen] = useState(false);
  const [isSetAvatarModalOpen, setIsSetAvatarModalOpen] = useState(false);
  const [isCreateSpaceModalOpen, setIsCreateSpaceModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const { useUploadThing } = generateReactHelpers();
  const { startUpload } = useUploadThing("imageUploader");
  const [roomId,setroomId]=useState("");
  const [rooms,setRooms]=useState([]);
  const [userrooms,setUserRooms]=useState([]);
  const [recent ,setRecent]=useState(true);
  const [avatars, setAvatars] = useState([]);
  const [Avatar, setAvatar] = useState({
    id: null,
    name: "",
    image: "",
    spiritImage: "",
  });
  const router = useRouter();
  const [slide, setSlide] = useState(null);

  const imageOptions = [
    "/placeholder.svg?height=100&width=100&text=Image1",
    "/placeholder.svg?height=100&width=100&text=Image2",
    "/placeholder.svg?height=100&width=100&text=Image3",
    "/placeholder.svg?height=100&width=100&text=Image4",
  ];

  useEffect(() => {
    fetchRooms();
    fetchAvatar();
  }, []);

  const fetchAvatar = async () => {
    const response = await axios.get("/api/Avatar");
    setAvatars(response.data.avatars);
    console.log(response.data.avatars);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const response = await axios.get("/api/Room");
    console.log(response.data);
    setRooms(response.data.rooms);
    setUserRooms(response.data.userrooms);
  };

  const handleClick = (roomId) => {
    setroomId(roomId);
    setIsSetAvatarModalOpen(true);
  };

  const handleCreateRoom = () => {
    if (!Avatar.id) {
      setIsSetAvatarModalOpen(true);
    }

    setIsCreateSpaceModalOpen(true);
  };

  const handleEnterRoom = () => {
    setIsEnterCodeModalOpen(true);
    if(!Avatar.id)
    {
      setIsSetAvatarModalOpen(true);
    }
   
  }

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

  const joinGlobalRoom = async () => {
    console.log("check",slide.roomId, Avatar.id);
    const response = await axios.put("/api/Global", {
      roomId:slide.roomId,
      avatarId: Avatar.id,
    });
    const { msg } = response.data;
    console.log(msg);
    if (msg === "room is not full" || msg === "User already in room") {
      router.push(`/spaces/${slide.roomId}`);
    }
  }

  const joinRoom = async () => {
    console.log(slide);
    if(slide)
    {
      console.log("slide",slide.roomId);
      setroomId(slide.roomId);
      joinGlobalRoom();
      return;
    }
    const response = await axios.put("/api/Room", {
      roomId,
      avatarId: Avatar.id,
    });
    const { msg } = response.data;
    console.log(msg);
    if (msg === "room is not full" || msg === "User already in room") {
      router.push(`/spaces/${roomId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-12"></div>
        <div className="flex items-center gap-4">
          <Link
            href={"/"}
            className="px-6 py-2 text- bg-transparent rounded-full border-2 border-[#00B37D] hover:bg-[#00B37D] hover:text-white transition-colors"
          >
           Home Page
          </Link>
          <UserButton />
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Carousel slides={slides}  setIsSetAvatarModalOpen={setIsSetAvatarModalOpen} setSlide={setSlide} Avatar={Avatar}/>

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
              onClick={handleEnterRoom}
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
            >
              Enter with Code
            </button>
            <button
              onClick={handleCreateRoom}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Create Space
            </button>
          </div>
        </div>

    {Avatar.id &&    <Modal
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
        </Modal>}

        <Modal
          isOpen={isSetAvatarModalOpen}
          onClose={() => setIsSetAvatarModalOpen(false)}
          title="Set Your Avatar"
        >
          <div className="flex-col gap-4">
            <div className="grid grid-cols-5">
              {avatars.map((ele) => (
                <button
                  key={ele.id}
                  type="button"
                  onClick={() => {
                    setAvatar(ele);
                    if(isEnterCodeModalOpen)
                    {
                       setIsSetAvatarModalOpen(false);
                    }
                  }}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    Avatar.image === ele.image
                      ? "border-purple-500 ring-2 ring-purple-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={ele.image || "/placeholder.svg"}
                    width={100}
                    height={100}
                    alt="avatar"
                    className=""
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 p-2">
                    <p className="text-white text-sm text-center">{ele.name}</p>
                  </div>
                </button>
              ))}
            </div>

            {Avatar.id && (
              <button className="bg-slate-400 border-black" onClick={joinRoom}>
                {" "}
                JOIN ROOM
              </button>
            )}
          </div>
        </Modal>

        {Avatar.id && (
          <CreateSpaceModal
            isOpen={isCreateSpaceModalOpen}
            onClose={() => setIsCreateSpaceModalOpen(false)}
            avatarId={Avatar.id}
          />
        )}
        {recent &&
          rooms.map((ele) => (
            <button
              key={ele.id}
              type="button"
              onClick={(e) => {
                handleClick(ele.id);
              }}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all border-gray-200 hover:border-gray-300`}
            >
              <Image
                width={200}
                height={200}
                src={ele.Map.image}
                alt="roomsInage"
                className=""
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
              onClick={(e) => {
                handleClick(ele.id);
              }}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all border-gray-200 hover:border-gray-300`}
            >
              <Image
                width={200}
                height={200}
                src={ele.Map.image}
                alt="roomsInage"
                className=""
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
