"use client";
import ChatboxPage from "@/components/alfathai/chatbox";

const voicePage = () => {
  return (
    <div className="min-h-screen p-8 pt-24 bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Alfath AI
          </h2>
          <div className="justify-between p-8 max-w-2xl m-auto">
            <ChatboxPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default voicePage;
