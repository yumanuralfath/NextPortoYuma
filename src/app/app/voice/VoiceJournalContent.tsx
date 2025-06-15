"use client";

import { useEffect, useState } from "react";
import AudioRecorder from "@/components/voice/AudioRecorder";
import VoiceJournalCalendar from "@/components/voice/VoiceJournalCalendar";
import { getVoices } from "@/lib/voice";
import { useUserStore } from "@/store/useUserStore";

const VoiceJournalContent = () => {
  const [hasUploadedToday, setHasUploadedToday] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const checkUploadToday = async () => {
      const userData = useUserStore.getState().user;
      if (!userData) return;

      const today = new Date().toISOString().slice(0, 10);
      const res = await getVoices(userData.id.toString(), today);
      setHasUploadedToday(res.length > 0);
    };

    checkUploadToday();
  }, []);

  if (hasUploadedToday === null) {
    return (
      <div className="text-center py-20 text-xl text-cyan-300 font-mono animate-pulse">
        Checking today's journal status...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {!hasUploadedToday ? (
        <div className="bg-black bg-opacity-70 rounded-3xl shadow-cyberpunk p-4 sm:p-6 md:p-10 border border-pink-500">
          <h2 className="text-4xl font-bold text-center mb-6 text-pink-400 drop-shadow-glow">
            Voice Journal
          </h2>
          <div className="justify-between text-center p-8 max-w-2xl m-auto">
            <AudioRecorder />
          </div>
        </div>
      ) : (
        <div className="bg-black bg-opacity-70 rounded-3xl shadow-cyberpunk p-4 sm:p-6 md:p-10 border border-cyan-500 animate-fade-in">
          <h3 className="text-3xl font-bold text-center mb-6 text-cyan-300 drop-shadow-glow">
            ✅ You've already uploaded today!
          </h3>
          <p className="text-center text-pink-200 mb-6">
            Browse your past entries or listen to today’s journal.
          </p>
          <VoiceJournalCalendar />
        </div>
      )}
    </div>
  );
};

export default VoiceJournalContent;
