"use client";

import React, { useState, useRef, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import axios from "axios";
import {
  ImageIcon,
  SmileIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { storage } from "@/app/lib/firebase";
import Image from "next/image";

export default function ThreadPost() {
  const [content, setContent] = useState("");
  const [imageUploads, setImageUploads] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      imageUploads.forEach((file) =>
        URL.revokeObjectURL(URL.createObjectURL(file))
      );
    };
  }, [imageUploads]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setImageUploads((prevUploads) => [...prevUploads, ...newFiles]);
      const newUrls = newFiles.map((file) => URL.createObjectURL(file));
      setImageUrls((prevUrls) => [...prevUrls, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImageUploads((prevUploads) => prevUploads.filter((_, i) => i !== index));
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    if (currentImageIndex >= imageUrls.length - 1) {
      setCurrentImageIndex(Math.max(0, imageUrls.length - 2));
    }
  };

  const uploadImages = async () => {
    try {
      const uploadedUrls = await Promise.all(
        imageUploads.map(async (image) => {
          const imageRef = ref(storage, `threads/${image.name + v4()}`);
          const snapshot = await uploadBytes(imageRef, image);
          return getDownloadURL(snapshot.ref);
        })
      );
      return uploadedUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const uploadedImageUrls = await uploadImages();

      const response = await axios.post("/api/post-thread", {
        content,
        imageUrls: uploadedImageUrls,
      });

      setIsLoading(false);

      if (response.status === 200) {
        setContent("");
        setImageUploads([]);
        setImageUrls([]);
        setCurrentImageIndex(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // You might want to update the thread list or show a success message here
      } else {
        console.error("Failed to create thread");
      }
    } catch (error) {
      console.error("Error creating thread:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex space-x-4 p-4 border-b border-gray-200 dark:border-gray-800">
      <Avatar>
        <AvatarImage
          src="/placeholder.svg?height=40&width=40"
          alt="User avatar"
        />
        <AvatarFallback>UN</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent text-xl placeholder-gray-500 border-none focus:ring-0 resize-none"
          />

          {imageUrls.length > 0 && (
            <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <Image
                src={imageUrls[currentImageIndex]}
                alt={`Uploaded image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                width={100}
                height={100}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeImage(currentImageIndex);
                }}
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-opacity"
                aria-label="Remove image"
              >
                <XIcon className="w-4 h-4" />
              </button>
              {imageUrls.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? imageUrls.length - 1 : prev - 1
                      );
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-opacity"
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentImageIndex((prev) =>
                        prev === imageUrls.length - 1 ? 0 : prev + 1
                      );
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-opacity"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </>
              )}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {imageUrls.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? "bg-white" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-4 text-gray-500">
              <label htmlFor="image-upload" className="cursor-pointer">
                <ImageIcon className="w-5 h-5" />
                <Input
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                />
              </label>
              <SmileIcon className="w-5 h-5" />
              <CalendarIcon className="w-5 h-5" />
            </div>
            <Button
              className=" bg-blue-500 hover:bg-blue-600 rounded-full p-3"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Posting..." : "Post Thread"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
