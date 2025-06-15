"use client";

import { useEffect, useState } from "react";
import AudioRecorder from "@/components/voice/AudioRecorder";
import VoiceJournalCalendar from "@/components/voice/VoiceJournalCalendar";
import { getVoices } from "@/lib/voice";
import { useUserStore } from "@/store/useUserStore";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { getJsonWithToken } from "@/lib/fetchLib";
import BASE_URL from "@/lib/baseUrl";
import { humanReadableDate } from "@/lib/Time";

interface WeeklyResumeData {
  id: number;
  user_id: number;
  voices_week_journal: string;
  created_at: string;
  updated_at: string;
}

const VoiceJournalContent = () => {
  const [hasUploadedToday, setHasUploadedToday] = useState<boolean | null>(
    null
  );
  const [weeklyResume, setWeeklyResume] = useState<WeeklyResumeData | null>(
    null
  );
  // const [loadingResume, setLoadingResume] = useState(false);

  const user = useUserStore.getState().user;

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
    const isTodaySunday = new Date().getDay() === 0;

    const fetchWeeklyResume = async () => {
      if (!user || !isTodaySunday) return;

      // setLoadingResume(true);
      try {
        const res = await withErrorHandler(
          () => getJsonWithToken(`${BASE_URL}/voice/weekly-resume`),
          "Gagal ambil resume mingguan"
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
      } finally {
        // setLoadingResume(false);
      }
    };

    fetchWeeklyResume();
  }, [user]);

  if (hasUploadedToday === null) {
    return (
      <div className="text-center py-20 text-xl text-cyan-300 font-mono animate-pulse">
        Checking today's journal status...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Tampilkan Resume jika ada */}
      {weeklyResume && (
        <div className="bg-purple-950 text-pink-100 border border-pink-400 rounded-xl p-6 shadow-lg space-y-4 max-w-3xl mx-auto animate-fade-in">
          <h2 className="text-2xl font-bold text-center text-pink-300 drop-shadow-glow">
            🗓️ Kilas Balik Mingguan
          </h2>
          <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base font-mono text-cyan-200">
            {weeklyResume.voices_week_journal}
            <div className="mt-4 text-right text-xs text-cyan-400 italic">
              Dibuat: {humanReadableDate(weeklyResume.created_at)}
            </div>
          </div>
        </div>
      )}

      {/* Tampilkan Resume jika sedang loading atau sudah ada */}
      {/* {(loadingResume || weeklyResume) && (
        <div className="bg-purple-950 text-pink-100 border border-pink-400 rounded-xl p-6 shadow-lg space-y-4 max-w-3xl mx-auto animate-fade-in">
          <h2 className="text-2xl font-bold text-center text-pink-300 drop-shadow-glow">
            🗓️ Kilas Balik Mingguan
          </h2>

          {loadingResume ? (
            <p className="text-center text-cyan-400 animate-pulse">
              Mengambil ringkasan minggu ini...
            </p>
          ) : (
            weeklyResume && (
              <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base font-mono text-cyan-200">
                {weeklyResume.voices_week_journal}
                <div className="mt-4 text-right text-xs text-cyan-400 italic">
                  Dibuat: {weeklyResume.created_at}
                </div>
              </div>
            )
          )}
        </div>
      )} */}

      {/* Konten voice harian */}
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
