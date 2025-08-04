"use client";

import { useEffect, useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import UploadImage from "@/components/General/UploadImage";
import { getCurrentUser } from "@/lib/auth";
import { User } from "@/types";
import { removeUser } from "@/lib/removeUserAfterLogout";

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
    removeUser();
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
    <div className="min-h-screen p-8 pt-24 bg-gray-100 dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-purple-950 text-gray-800 dark:text-neon-green">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-purple-700 rounded-2xl shadow-lg dark:shadow-[0_0_25px_#8e2de2] p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 mb-4 group">
              <Image
                src={user.profile_picture_url}
                alt="Profile Picture"
                fill
                className="rounded-full object-cover border-4 border-gray-300 dark:border-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowUpload(true)}
                onKeyDown={(event) =>
                  handleKeyDown(event, () => setShowUpload(true))
                }
                className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 dark:bg-purple-700 dark:bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Change profile picture"
              >
                <p className="text-white dark:text-neon-green font-semibold">Change</p>
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-purple-500 tracking-wide dark:drop-shadow-[0_0_5px_#0ff]">
              {user.username}
            </h1>
            <p className="text-gray-500 dark:text-purple-300">{user.email}</p>
          </div>

          {showUpload && (
            <dialog
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
              aria-labelledby="uploadModalTitle"
              aria-modal="true"
            >
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-purple-500 rounded-lg p-6 w-96 shadow-lg dark:shadow-[0_0_20px_#0ff]">
                <h2
                  id="uploadModalTitle"
                  className="text-xl font-semibold mb-4 text-gray-900 dark:text-neon-green"
                >
                  Upload Profile Picture
                </h2>
                <UploadImage onUploadSuccess={handleUploadSuccess} />
                <button
                  onClick={() => setShowUpload(false)}
                  onKeyDown={(event) =>
                    handleKeyDown(event, () => setShowUpload(false))
                  }
                  className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </dialog>
          )}

          <div className="flex justify-between pt-6">
            <button
              onClick={() => router.push("/app")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-cyan-600 dark:hover:bg-cyan-700 transition-colors shadow-md dark:shadow-[0_0_10px_#00ffff]"
            >
              App
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-pink-600 dark:hover:bg-pink-700 transition-colors shadow-md dark:shadow-[0_0_10px_#ff00ff]"
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
