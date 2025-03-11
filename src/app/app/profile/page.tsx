"use client";

import { useEffect, useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import UploadImage from "@/components/General/UploadImage";
import { removeAccessToken } from "@/lib/fetchLib";

interface User {
  username: string;
  email: string;
  profile_picture_url: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/yuma-app");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    removeAccessToken();
    router.push("/yuma-app");
  };

  const handleUploadSuccess = (newImageUrl: string) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        profile_picture_url: newImageUrl,
      };
    });

    const updatedUser = { ...user, profile_picture_url: newImageUrl };
    if (updatedUser.profile_picture_url) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    setShowUpload(false);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    action: () => void
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-8 pt-24 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 mb-4 group">
              {/* Profile Picture */}
              <Image
                src={user.profile_picture_url}
                alt="Profile Picture"
                fill
                className="rounded-full object-cover"
              />
              {/* Overlay Upload */}
              <button
                type="button"
                onClick={() => setShowUpload(true)}
                onKeyDown={(event) =>
                  handleKeyDown(event, () => setShowUpload(true))
                }
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Change profile picture"
              >
                <p className="text-white font-semibold">Change Photo</p>
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              {user.username}
            </h1>
            <p className="text-gray-600">{user.email}</p>
          </div>

          {/* Upload Overlay */}
          {showUpload && (
            <dialog
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              aria-labelledby="uploadModalTitle"
              aria-modal="true"
            >
              <div className="bg-white rounded-lg p-6 w-96">
                <h2
                  id="uploadModalTitle"
                  className="text-xl font-semibold mb-4 text-gray-800"
                >
                  Upload Profile Picture
                </h2>
                <UploadImage onUploadSuccess={handleUploadSuccess} />
                <button
                  onClick={() => setShowUpload(false)}
                  onKeyDown={(event) =>
                    handleKeyDown(event, () => setShowUpload(false))
                  }
                  className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </dialog>
          )}

          <div className="flex justify-between pt-6">
            <button
              onClick={() => router.push("/app")}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              App
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
