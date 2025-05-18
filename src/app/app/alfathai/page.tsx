"use client";
import ChatboxPage from "@/components/alfathai/chatbox";

const VoicePage = () => {
  return (
    <div className="min-h-screen p-4 pt-12 bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
            Alfath AI
          </h2>
          <div className="p-2 sm:p-4 max-w-2xl mx-auto">
            <ChatboxPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoicePage;
