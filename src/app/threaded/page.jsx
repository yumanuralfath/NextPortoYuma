"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ThreadPage = () => {
  const router = useRouter();
  const [threads, setThreads] = useState([]);
  const [newThread, setNewThread] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/codex");
      return;
    }
    // Example: Fetch threads from an API or local storage
    setThreads([
      { id: 1, content: "Thread pertama", likes: 10, comments: [] },
      { id: 2, content: "Thread kedua", likes: 5, comments: [] },
    ]);
  }, [router]);

  const handleAddThread = () => {
    if (newThread.trim() === "") return;
    const newThreadObj = {
      id: threads.length + 1,
      content: newThread,
      likes: 0,
      comments: [],
    };
    setThreads([newThreadObj, ...threads]);
    setNewThread("");
  };

  const handleLikeThread = (id) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id ? { ...thread, likes: thread.likes + 1 } : thread
      )
    );
  };

  const handleAddComment = (id, comment) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              comments: [...thread.comments, comment],
            }
          : thread
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">My App</h1>
          <button
            onClick={() => router.push("/profile")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Profile
          </button>
        </div>
      </nav>

      <div className="pt-24 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Threads</h1>
          <div className="mb-6">
            <textarea
              value={newThread}
              onChange={(e) => setNewThread(e.target.value)}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tulis thread baru..."
            ></textarea>
            <button
              onClick={handleAddThread}
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Tambah Thread
            </button>
          </div>

          <div className="space-y-6">
            {threads.map((thread) => (
              <div
                key={thread.id}
                className="border-t border-gray-200 pt-4 space-y-4"
              >
                <p className="text-gray-800">{thread.content}</p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleLikeThread(thread.id)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Like ({thread.likes})
                  </button>
                  <div className="w-full max-w-md">
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tambahkan komentar..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value.trim() !== "") {
                          handleAddComment(thread.id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2 pl-4">
                  {thread.comments.map((comment, index) => (
                    <p key={index} className="text-gray-600 text-sm">
                      - {comment}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadPage;
