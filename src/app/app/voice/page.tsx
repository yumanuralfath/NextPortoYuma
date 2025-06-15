"use client";

import dynamic from "next/dynamic";

const VoiceJournalContent = dynamic(() => import("./VoiceJournalContent"), {
  ssr: false,
});

const VoicePage = () => {
  return (
    <div className="min-h-screen p-4 pt-12 bg-gradient-to-br from-black via-purple-900 to-indigo-900 text-neon">
      <VoiceJournalContent />
    </div>
  );
};

export default VoicePage;
