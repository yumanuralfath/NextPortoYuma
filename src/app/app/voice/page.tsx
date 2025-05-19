"use client";
import AudioRecorder from "@/components/voice/AudioRecorder";

const voicePage = () => {
  return (
    <div className="min-h-screen p-4 pt-12 bg-gradient-to-br from-black via-purple-900 to-indigo-900 text-neon">
      <div className="max-w-6xl mx-auto">
        <div className="bg-black bg-opacity-70 rounded-3xl shadow-cyberpunk p-4 sm:p-6 md:p-10 border border-pink-500">
          <h2 className="text-4xl font-bold text-center mb-6 text-pink-400 drop-shadow-glow">
            Voice Journal
          </h2>
          <div className="justify-between text-center p-8 max-w-2xl m-auto">
            <AudioRecorder />
          </div>
        </div>
      </div>
    </div>
  );
};

export default voicePage;
