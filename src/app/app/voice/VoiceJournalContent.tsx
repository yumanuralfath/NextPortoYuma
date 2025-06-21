"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AudioRecorder from "@/components/voice/AudioRecorder";
import VoiceJournalCalendar from "@/components/voice/VoiceJournalCalendar";
import { WeeklySummary } from "@/components/voice/WeeklySummary";
import { getVoices } from "@/lib/voice";
import { useUserStore } from "@/store/useUserStore";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { getJsonWithToken } from "@/lib/fetchLib";
import BASE_URL from "@/lib/baseUrl";

interface WeeklyResumeData {
  id: number;
  user_id: number;
  voices_week_journal: string;
  created_at: string;
  updated_at: string;
}

const tabs = [
  { id: "record", label: "🎙️ Record " },
  { id: "calendar", label: "📅 Calender" },
];

const VoiceJournalContent = () => {
  const [hasUnsavedRecording, setHasUnsavedRecording] = useState(false);
  const [hasUploadedToday, setHasUploadedToday] = useState<boolean | null>(
    null
  );
  const [weeklyResume, setWeeklyResume] = useState<WeeklyResumeData | null>(
    null
  );
  const [view, setView] = useState<"record" | "calendar" | null>(null);

  const user = useUserStore.getState().user;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedRecording) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedRecording]);

  useEffect(() => {
    const checkUploadToday = async () => {
      if (!user) return;
      const today = new Date().toISOString().slice(0, 10);
      const res = await getVoices(user.id.toString(), today);
      setHasUploadedToday(res.length > 0);
    };

    checkUploadToday();
  }, [user]);

  useEffect(() => {
    if (hasUploadedToday !== null) {
      setView(hasUploadedToday ? "calendar" : "record");
    }
  }, [hasUploadedToday]);

  useEffect(() => {
    const isTodaySunday = new Date().getDay() === 0;

    const fetchWeeklyResume = async () => {
      if (!user || !isTodaySunday) return;

      try {
        const res = await withErrorHandler(
          () => getJsonWithToken(`${BASE_URL}/voice/weekly-resume`),
          "Failed to get weekly resume"
        );
        const resumeDate = new Date(res.created_at);
        const today = new Date();

        const isSameWeek =
          resumeDate.getFullYear() === today.getFullYear() &&
          Math.abs(resumeDate.getTime() - today.getTime()) <
            7 * 24 * 60 * 60 * 1000;

        if (isSameWeek) {
          setWeeklyResume(res);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchWeeklyResume();
  }, [user]);

  if (view === null) {
    return (
      <div className="text-center py-20 text-xl text-cyan-300 font-mono animate-pulse">
        Checking today's journal status...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {weeklyResume && (
        <WeeklySummary
          journal={weeklyResume.voices_week_journal}
          createdAt={weeklyResume.created_at}
        />
      )}

      <div className="flex justify-center gap-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (view !== tab.id) {
                if (hasUnsavedRecording) {
                  const confirmSwitch = window.confirm(
                    "⚠️ You have an unsaved recording. Switching tabs will discard it. Continue?"
                  );
                  if (!confirmSwitch) return;
                }
                setView(tab.id as typeof view);
              }
            }}
            className={`relative px-4 py-2 rounded font-mono text-sm border transition duration-300 overflow-hidden ${
              view === tab.id
                ? "bg-gradient-to-r from-pink-600 to-cyan-600 text-black border-pink-300 shadow-md"
                : "bg-black text-pink-200 border-pink-500 hover:bg-pink-950"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-black bg-opacity-70 rounded-3xl shadow-cyberpunk p-4 sm:p-6 md:p-10 border border-pink-500 relative min-h-[300px]">
        <AnimatePresence mode="wait">
          {view === "record" && (
            <motion.div
              key="record"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-center text-pink-400 drop-shadow-glow">
                Voice Journal
              </h2>
              <div className="justify-between text-center p-8 max-w-2xl m-auto">
                <AudioRecorder
                  onRecordingStateChange={setHasUnsavedRecording}
                  onSaveSuccess={() => setHasUnsavedRecording(false)}
                />
              </div>
            </motion.div>
          )}

          {view === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-center mb-4 text-cyan-300">
                ✅ Voice Journal Calendar
              </h3>
              <p className="text-center text-pink-200 mb-4">
                Browse your past entries or listen to today’s journal.
              </p>
              <VoiceJournalCalendar />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VoiceJournalContent;
