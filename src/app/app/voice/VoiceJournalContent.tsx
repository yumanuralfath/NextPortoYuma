"use client";

import AudioRecorder from "@/components/voice/AudioRecorder";
import VoiceJournalCalendar from "@/components/voice/VoiceJournalCalendar";

const VoiceJournalContent = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="bg-black bg-opacity-70 rounded-3xl shadow-cyberpunk p-4 sm:p-6 md:p-10 border border-pink-500">
        <h2 className="text-4xl font-bold text-center mb-6 text-pink-400 drop-shadow-glow">
          Voice Journal
        </h2>
        <div className="justify-between text-center p-8 max-w-2xl m-auto">
          <AudioRecorder />
        </div>
      </div>

      {/* Kalender & Playback */}
      <div className="bg-black bg-opacity-70 rounded-3xl shadow-cyberpunk p-4 sm:p-6 md:p-10 border border-cyan-500">
        <h3 className="text-3xl font-bold text-center mb-6 text-cyan-300 drop-shadow-glow">
          📅 Browse Journal by Date
        </h3>
        <VoiceJournalCalendar />
      </div>
    </div>
  );
};

export default VoiceJournalContent;
