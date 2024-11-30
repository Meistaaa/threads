"use client";
import { useState, useCallback } from "react";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/app/lib/firebase";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import getCroppedImg from "@/app/helpers/getCroppedImage";
import Cropper from "react-easy-crop";

// Define Zod schema
const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long."),
  bio: z.string().optional(),
  profilePic: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function deleteImageByUrl(imageUrl: string) {
  const storage = getStorage();
  const imageRef = ref(storage, imageUrl);
  deleteObject(imageRef)
    .then(() => {
      console.log("Old image deleted successfully.");
    })
    .catch((error) => {
      console.error("Error deleting old image:", error);
    });
}

export default function OnBoardingPage() {
  const [oldProfilePic, setOldProfilePic] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<null | {
    x: number;
    y: number;
    width: number;
    height: number;
  }>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const profilePic = watch("profilePic");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };
  const onCropComplete = useCallback(
    ({
      croppedAreaPixels,
    }: {
      croppedAreaPixels: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleFormSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      let profilePicUrl = data.profilePic;

      if (file && croppedAreaPixels && preview) {
        try {
          const croppedImage = await getCroppedImg(preview, croppedAreaPixels);
          const blob = await fetch(croppedImage).then((r) => {
            if (!r.ok)
              throw new Error(`Failed to fetch cropped image: ${r.statusText}`);
            return r.blob();
          });

          const storageRef = ref(storage, `profile-pics/${uuidv4()}`);
          await uploadBytes(storageRef, blob);
          profilePicUrl = await getDownloadURL(storageRef);
          setValue("profilePic", profilePicUrl); // Update profilePic in form state
        } catch (error) {
          setError("Failed to process and upload the profile picture.");
          return;
        }
      }

      const response = await axios.post("/api/onboarding", {
        username: data.username,
        bio: data.bio,
        avatar: profilePicUrl,
      });

      if (response.data.success) {
        if (oldProfilePic && oldProfilePic !== profilePicUrl) {
          deleteImageByUrl(oldProfilePic);
        }
      } else {
        setError(response.data.message || "Failed to update the profile.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="w-full max-w-lg p-6 space-y-6 bg-white shadow-md rounded-lg"
      >
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-2">
          <Label
            htmlFor="profile-pic"
            className="block font-medium text-gray-700"
          >
            Profile Picture
          </Label>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border border-gray-300">
              <AvatarImage src={profilePic} alt="Profile" />
              <AvatarFallback className="bg-gray-200 text-gray-600">
                {watch("username")?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Label
              htmlFor="profile-pic-upload"
              className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload
            </Label>
            <Input
              id="profile-pic-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {preview && (
          <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden shadow">
            <Cropper
              image={preview}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="username" className="block font-medium text-gray-700">
            Username
          </Label>
          <Input
            id="username"
            {...register("username")}
            className={`block w-full px-4 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="block font-medium text-gray-700">
            Bio
          </Label>
          <Textarea
            id="bio"
            {...register("bio")}
            className={`block w-full px-4 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 ${
              errors.bio ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Tell us something about yourself"
          />
          {errors.bio && (
            <p className="text-red-500 text-sm">{errors.bio.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
