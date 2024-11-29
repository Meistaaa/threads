import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Cleanup newly uploaded but unsaved images on component unmount
    return () => {
      if (file && profilePic !== oldProfilePic) {
        deleteImageByUrl(profilePic);
      }
    };
  }, [file, profilePic, oldProfilePic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let profilePicUrl = profilePic;

      // Upload the new profile pic to Firestore if a new file is selected
      if (file) {
        const storage = getStorage();
        const storageRef = ref(storage, `profile-pics/${uuidv4()}`);

        try {
          await uploadBytes(storageRef, file);
          profilePicUrl = await getDownloadURL(storageRef);
        } catch (uploadError) {
          setLoading(false);
          setError("Failed to upload profile picture. Please try again.");
          return; // Stop the form submission if the upload fails
        }
      }

      // Send the updated user data, including the profile picture URL, to your API
      try {
        const response = await axios.post("/api/edit-user-profile", {
          username,
          bio,
          imageUrl: profilePicUrl, // Use imageUrl to match the API
        });

        if (response.data.success) {
          // Delete old image if it was replaced
          if (oldProfilePic && oldProfilePic !== profilePicUrl) {
            deleteImageByUrl(oldProfilePic);
          }

          // Call the onSave callback to update the parent component
          onSave(response.data);
        } else {
          setError(response.data.message || "Failed to update the profile.");
        }
      } catch (apiError) {
        setError("Failed to update the profile. Please try again.");
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
          {/* Avatar component from ShadCN */}
          <Avatar className="w-16 h-16">
            <AvatarImage src={profilePic} alt="Profile" />
            {username && (
              <AvatarFallback>
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
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
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) {
                setFile(selectedFile);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setProfilePic(reader.result as string);
                };
                reader.readAsDataURL(selectedFile);
              }
            }}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-zinc-700 border-zinc-600 text-white"
        />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="bg-zinc-700 border-zinc-600 text-white"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
