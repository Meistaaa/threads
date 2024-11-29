import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import getCroppedImg from "@/app/helpers/getCroppedImage";

interface User {
  username: string;
  bio: string;
  profilePic: string;
}

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

export default function EditProfile({
  username: initialUsername,
  bio: initialBio,
  profilePic: initialProfilePic,
  onSave,
}: {
  username: string;
  bio: string;
  profilePic: string;
  onSave: (data: User) => void;
}) {
  const [username, setUsername] = useState(initialUsername);
  const [bio, setBio] = useState(initialBio);
  const [profilePic, setProfilePic] = useState(initialProfilePic);
  const [oldProfilePic, setOldProfilePic] = useState(initialProfilePic);
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

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("hello");
    try {
      let profilePicUrl = profilePic;

      console.log("hello2");
      if (file && croppedAreaPixels && preview) {
        try {
          console.log("Starting image cropping...");
          const croppedImage = await getCroppedImg(preview, croppedAreaPixels);
          console.log("Cropped image URL:", croppedImage);

          const blob = await fetch(croppedImage).then((r) => {
            if (!r.ok)
              throw new Error(`Failed to fetch cropped image: ${r.statusText}`);
            return r.blob();
          });
          console.log("Fetched image blob:", blob);

          const storageRef = ref(storage, `profile-pics/${uuidv4()}`);
          console.log("Uploading to Firebase Storage...");

          await uploadBytes(storageRef, blob);
          console.log("Upload successful, fetching download URL...");

          profilePicUrl = await getDownloadURL(storageRef);
          console.log("Download URL:", profilePicUrl);
        } catch (error) {
          console.error("Error in image upload process:", error);
          setError("Failed to process and upload the profile picture.");
          return;
        }
      }

      console.log("hello4");

      const response = await axios.post("/api/edit-user-profile", {
        username,
        bio,
        avatar: profilePicUrl,
      });

      console.log("hello5");
      if (response.data.success) {
        if (oldProfilePic && oldProfilePic !== profilePicUrl) {
          deleteImageByUrl(oldProfilePic);
        }
        onSave(response.data);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <Label htmlFor="profile-pic">Profile Picture</Label>
        <div className="flex items-center gap-2 mt-1">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profilePic} alt="Profile" />
            <AvatarFallback>{username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Label
            htmlFor="profile-pic-upload"
            className="cursor-pointer bg-zinc-700 text-white px-3 py-2 rounded-md hover:bg-zinc-600 transition-colors"
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
        <div className="relative w-full h-64 bg-gray-800">
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
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
