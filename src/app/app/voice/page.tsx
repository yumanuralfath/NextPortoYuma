"use client";

import dynamic from "next/dynamic";

const VoiceJournalContent = dynamic(() => import("./VoiceJournalContent"), {
  ssr: false,
});

const VoicePage = () => {
  return (
    <div className="min-h-screen p-4 pt-12 bg-gray-100 dark:bg-gradient-to-br dark:from-black dark:via-purple-900 dark:to-indigo-900 text-gray-800 dark:text-neon">
      <VoiceJournalContent />
    </div>
  );
};

export default VoicePage;
