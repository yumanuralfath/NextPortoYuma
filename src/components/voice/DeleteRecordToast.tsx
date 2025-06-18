/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import toast from "react-hot-toast";
import { getVoices, deleteVoices, deleteVoiceToday } from "@/lib/voice";
import { useUserStore } from "@/store/useUserStore";

export default function DeleteReRecordToast({
  t,
  user,
  onSuccess,
}: {
  t: any;
  user: any;
  onSuccess: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const userData = useUserStore.getState().user;
      const updatedUser = user ?? userData;
      const today = new Date().toISOString().slice(0, 10);
      const response = await getVoices(updatedUser.id.toString(), today);

      if (!response.length) throw new Error("No voice found to delete");

      const createdAt = new Date(response[0].created_at);
      const date = createdAt.toISOString().split("T")[0];

      const test = await deleteVoiceToday();
      console.log(test);
      const deleted = await deleteVoices(user.id.toString(), date);

      toast.dismiss(t.id);
      toast.success(
        `Recording deleted (${deleted})! You may now record again.`,
        {
          duration: 500,
          style: {
            border: "2px solid #ff00ff",
            padding: "16px",
            color: "#00ffff",
            background: "#1a001a",
            boxShadow: "0 0 20px #ff00ff",
            fontFamily: "monospace",
          },
          iconTheme: {
            primary: "#00ffff",
            secondary: "#ff00ff",
          },
        }
      );
      onSuccess();
      localStorage.removeItem("lastUploadDate");
    } catch (error: any) {
      toast.error(`Failed to delete recording. ${error.message || error}`, {
        duration: 1000,
        style: {
          border: "2px solid #ff00ff",
          padding: "16px",
          color: "#00ffff",
          background: "#1a001a",
          boxShadow: "0 0 20px #ff00ff",
          fontFamily: "monospace",
        },
        iconTheme: {
          primary: "#00ffff",
          secondary: "#ff00ff",
        },
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } fixed top-4 right-50 z-50`}
    >
      <div className="flex flex-col space-y-4 p-4 bg-[#1a001a] border-2 border-pink-600 rounded-xl shadow-[0_0_20px_#ff00ff] text-pink-300 font-mono w-80 max-w-[90vw]">
        <span className="text-pink-400 text-sm text-center">
          ⚠️ You've already recorded your voice today.
        </span>
        <button
          disabled={isDeleting}
          onClick={handleDelete}
          className={`bg-pink-600 text-black font-bold px-4 py-2 rounded hover:bg-pink-500 transition duration-300 shadow-[0_0_10px_#ff00ff] ${
            isDeleting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isDeleting ? "Deleting..." : "Delete & Re-record"}
        </button>
      </div>
    </div>
  );
}
