"use client";

import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../lib/firebase";
import { v4 } from "uuid";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import axios from "axios";

export default function ThreadCreate() {
  const [content, setContent] = useState("");
  const [imageUploads, setImageUploads] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageUploads(Array.from(event.target.files));
    }
  };

  const uploadImages = async () => {
    const uploadedUrls = await Promise.all(
      imageUploads.map(async (image) => {
        const imageRef = ref(storage, `threads/${image.name + v4()}`);
        const snapshot = await uploadBytes(imageRef, image);
        return getDownloadURL(snapshot.ref);
      })
    );
    setImageUrls(uploadedUrls);
    return uploadedUrls;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const uploadedImageUrls = await uploadImages();

      const response = await axios.post("/api/post-thread", {
        content,
        imageUrls: uploadedImageUrls,
      });

      if (response.status === 200) {
        setContent("");
        setImageUploads([]);
        setImageUrls([]);
        // You might want to update the thread list or show a success message here
      } else {
        console.error("Failed to create thread");
      }
    } catch (error) {
      console.error("Error creating thread:", error);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full"
      />
      <Input
        type="file"
        onChange={handleImageChange}
        multiple
        accept="image/*"
      />
      <div className="grid grid-cols-3 gap-2">
        {imageUploads.map((file, index) => (
          <div key={index} className="relative aspect-square">
            <Image
              src={URL.createObjectURL(file)}
              alt={`Upload preview ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Posting..." : "Post Thread"}
      </Button>
    </form>
  );
}
