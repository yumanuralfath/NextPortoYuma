"use client";

import { useEffect, useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import UploadImage from "@/components/General/UploadImage";
import { removeAccessToken } from "@/lib/fetchLib";
import { getCurrentUser } from "@/lib/auth";
import { User } from "@/types";

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.user);
      } catch (error) {
        console.error("Failed to fetch user", error);
        router.push("/yuma-app");
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    removeAccessToken();
    router.push("/yuma-app");
  };

  const handleUploadSuccess = (newImageUrl: string) => {
    setUser((prevUser) =>
      prevUser ? { ...prevUser, profile_picture_url: newImageUrl } : null
    );
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
    <div className="min-h-screen p-8 pt-24 bg-gradient-to-br from-black via-gray-900 to-purple-950 text-neon-green">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 border border-purple-700 rounded-2xl shadow-[0_0_25px_#8e2de2] p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 mb-4 group">
              <Image
                src={user.profile_picture_url}
                alt="Profile Picture"
                fill
                className="rounded-full object-cover border-4 border-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowUpload(true)}
                onKeyDown={(event) =>
                  handleKeyDown(event, () => setShowUpload(true))
                }
                className="absolute inset-0 flex items-center justify-center bg-purple-700 bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Change profile picture"
              >
                <p className="text-neon-green font-semibold">Change</p>
              </button>
            </div>
            <h1 className="text-3xl font-bold text-purple-500 tracking-wide drop-shadow-[0_0_5px_#0ff]">
              {user.username}
            </h1>
            <p className="text-purple-300">{user.email}</p>
          </div>

          {showUpload && (
            <dialog
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
              aria-labelledby="uploadModalTitle"
              aria-modal="true"
            >
              <div className="bg-gray-800 border border-purple-500 rounded-lg p-6 w-96 shadow-[0_0_20px_#0ff]">
                <h2
                  id="uploadModalTitle"
                  className="text-xl font-semibold mb-4 text-neon-green"
                >
                  Upload Profile Picture
                </h2>
                <UploadImage onUploadSuccess={handleUploadSuccess} />
                <button
                  onClick={() => setShowUpload(false)}
                  onKeyDown={(event) =>
                    handleKeyDown(event, () => setShowUpload(false))
                  }
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </dialog>
          )}

          <div className="flex justify-between pt-6">
            <button
              onClick={() => router.push("/app")}
              className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors shadow-[0_0_10px_#00ffff]"
            >
              App
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors shadow-[0_0_10px_#ff00ff]"
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
