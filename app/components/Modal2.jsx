"use client"
import { useState } from "react"
import { X, Upload } from "lucide-react"
import { generateReactHelpers } from "@uploadthing/react";
import axios from "axios";
import { useRouter } from "next/navigation";

const templateImages = [
  {
    id: 1,
    src: "https://6zbrwlnqfb.ufs.sh/f/ZiOcTFqmdHkJVtSINJbUFRyn97d6iOMz8wlAm1eTo5YLfIHk",
    alt: "Empty Space Template",
    title: "Empty Space",
  },
  {
    id: 2,
    src: "https://6zbrwlnqfb.ufs.sh/f/ZiOcTFqmdHkJIgw8OVOHzlXoRr38J4TusMLwKjPZgxyd1Y9D",
    alt: "Game Room Template",
    title: "Game Room",
  },
  {
    id: 3,
    src: "https://6zbrwlnqfb.ufs.sh/f/ZiOcTFqmdHkJCq1teNUdqDGhvWa1jib2LToVz8PrO4QuMen9",
    alt: "Meeting Room Template",
    title: "Meeting Room",
  },
  {
    id: 4,
    src: "https://6zbrwlnqfb.ufs.sh/f/ZiOcTFqmdHkJCQDXzRdqDGhvWa1jib2LToVz8PrO4QuMen93",
    alt: "Study Room Template",
    title: "Study Room",
  },
]

export function CreateSpaceModal({ isOpen, onClose }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [customImage, setCustomImage] = useState(null)
  const { useUploadThing } = generateReactHelpers();
  const { startUpload } = useUploadThing("imageUploader");
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
  })
  const router = useRouter();

  if (!isOpen) return null

  const handleImageUpload = async(e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
      }
      reader.readAsDataURL(file)

      const uploadedFiles = await startUpload([file]);
      if (uploadedFiles && uploadedFiles.length > 0) {
        const uploadedUrl = uploadedFiles[0].url;
        setCustomImage(uploadedUrl);
      }
    }
    }
  
  const handleSubmit = async(e) => {
    e.preventDefault();
   
    const data={
      ...formData,
      image: customImage,
    };


    const response =await axios.post("/api/Room", data);
    const roomId=response.data.room.id;
    router.push(`/spaces/${roomId}`); 
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-scroll">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold">Create New Space</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Space Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter space name"
                required
              />
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                Capacity
              </label>
              <input
                id="capacity"
                type="text"
                value={formData.capacity}
                onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter space capacity"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Custom Image</label>
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Choose Image
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Or Select Template</label>
              <div className="grid grid-cols-2 gap-4">
                {templateImages.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => {setSelectedImage(image.src),setCustomImage(image.src)}}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === image.src
                        ? "border-purple-500 ring-2 ring-purple-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/50 p-2">
                      <p className="text-white text-sm text-center">{image.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
              <div className="border border-gray-200 rounded-lg aspect-square overflow-hidden">
                {selectedImage ? (
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="Selected template"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No image selected
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-2 flex justify-end gap-4 border-t pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            {customImage &&<button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Create Space
            </button>}
          </div>
        </form>
      </div>
    </div>
  )
}

