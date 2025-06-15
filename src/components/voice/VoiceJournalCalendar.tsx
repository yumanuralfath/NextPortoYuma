/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import toast from "react-hot-toast";
import { getVoiceJournalbyDate, getVoices } from "@/lib/voice";
import { CloudinaryAudioResource } from "@/types";
import { toLocalDateStringIso } from "@/lib/Time";
import { useUserStore } from "@/store/useUserStore";

const VoiceJournalCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [journalText, setJournalText] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggedDates, setLoggedDates] = useState<string[]>([]);
  const [cache, setCache] = useState<
    Record<string, { journal: string; audio: string }>
  >({});

  const fetchVoiceLog = async (date: Date) => {
    const isoDate = toLocalDateStringIso(date);

    if (cache[isoDate]) {
      setJournalText(cache[isoDate].journal);
      setAudioUrl(cache[isoDate].audio);
      return;
    }

    setLoading(true);
    try {
      const userData = useUserStore.getState().user;
      if (!userData) throw new Error("User not found, Please Relog");

      const UserID = userData.id.toString();
      const [journalData, voices] = await Promise.all([
        getVoiceJournalbyDate(isoDate),
        getVoices(UserID, isoDate),
      ]);

      if (!journalData.data) throw new Error("No voice journal added Today");

      const journalText = journalData.data.voices_journal;
      const audio = voices.length > 0 ? voices[0].secure_url : "";

      setJournalText(journalText);
      setAudioUrl(audio);
      setCache((prev) => ({
        ...prev,
        [isoDate]: { journal: journalText, audio },
      }));
    } catch (error: any) {
      setJournalText(null);
      setAudioUrl(null);
      toast.error(error.message || "Failed to fetch voice journal.", {
        duration: 1500,
        style: {
          border: "2px solid #ff00ff",
          padding: "16px",
          color: "#00ffff",
          background: "#1a001a",
          boxShadow: "0 0 20px #ff00ff",
          fontFamily: "monospace",
        },
        iconTheme: {
          primary: "#00ffff",
          secondary: "#ff00ff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLoggedDates = async () => {
    const userData = useUserStore.getState().user;
    if (!userData) throw new Error("User not found, Please Relog");

    const UserID = userData.id.toString();
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await getVoices(UserID, today.slice(0, 7));
      setLoggedDates(
        res.map((v: CloudinaryAudioResource) => v.created_at.split("T")[0])
      );
    } catch (err) {
      console.error("Failed to fetch logged dates", err);
    }
  };

  useEffect(() => {
    if (selectedDate) fetchVoiceLog(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    fetchLoggedDates();
  }, []);

  const isDateLogged = (date: Date) => {
    const iso = date.toISOString().split("T")[0];
    return loggedDates.includes(iso);
  };

  const isLastDayOfMonth = (date: Date) => {
    const test = new Date(date);
    test.setDate(test.getDate() + 1);
    return test.getDate() === 1;
  };

  const isSunday = (date: Date) => {
    return date.getDay() === 0;
  };

  return (
    <div className="flex flex-col gap-6 items-center p-6 bg-black bg-opacity-70 rounded-3xl border border-pink-600 shadow-[0_0_30px_#ff00ff] text-pink-300">
      <div className="text-white">
        {/* <h3 className="text-2xl font-bold text-pink-400 mb-4">
          📅 Select a Day
        </h3> */}
        <Calendar
          onChange={(date) => setSelectedDate(date as Date)}
          value={selectedDate}
          calendarType="gregory"
          className="rounded-xl p-4 bg-[#0f001f] text-pink-200 shadow-[0_0_20px_#ff00ff] font-mono border border-pink-500"
          tileClassName={({ date }) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const isLogged = isDateLogged(date);
            const sunday = isSunday(date);
            const endMonth = isLastDayOfMonth(date);
            const isSelected =
              selectedDate &&
              date.toDateString() === selectedDate.toDateString();

            return [
              "transition-all duration-150 rounded-lg px-2 py-1",
              isToday &&
                !isSelected &&
                "bg-pink-600 text-black font-bold shadow-[0_0_10px_#ff00ff]",
              isLogged && "ring-2 ring-pink-400",
              isSelected &&
                "bg-cyan-600 text-black font-bold shadow-[0_0_10px_#00ffff]",
              sunday && "text-blue-400",
              endMonth && "text-yellow-400",
            ]
              .filter(Boolean)
              .join(" ");
          }}
        />
      </div>
      <div className="flex-1 max-w-3xl mx-auto w-full px-4">
        <h3 className="text-2xl font-bold text-pink-400 mb-4">
          🎙️ Journal Entry
        </h3>
        {loading ? (
          <p className="text-cyan-400 animate-pulse">Loading...</p>
        ) : journalText || audioUrl ? (
          <div className="space-y-4">
            {audioUrl && (
              <audio
                controls
                src={audioUrl}
                className="w-full rounded-xl shadow-md"
              />
            )}
            {journalText && (
              <div className="p-4 bg-[#1a001a] border border-pink-600 rounded-xl shadow-[0_0_10px_#ff00ff]">
                <h4 className="font-bold mb-2 text-cyan-400">📝 Journal:</h4>
                <p className="whitespace-pre-wrap text-pink-100 font-mono">
                  {journalText}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400 italic">No journal entry for this day.</p>
        )}
      </div>
    </div>
  );
};

export default VoiceJournalCalendar;
