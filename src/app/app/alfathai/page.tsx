"use client";
import ChatboxPage from "@/components/alfathai/chatbox";

const ChatAIPage = () => {
  return (
    <div className="min-h-screen p-4 pt-12 bg-gray-100 dark:bg-gradient-to-br dark:from-black dark:via-purple-900 dark:to-indigo-900 text-gray-800 dark:text-neon">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-black dark:bg-opacity-70 rounded-3xl shadow-lg dark:shadow-cyberpunk p-4 sm:p-6 md:p-10 border border-gray-200 dark:border-pink-500">
          <h2 className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-pink-400 dark:drop-shadow-glow">
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

export default ChatAIPage;
