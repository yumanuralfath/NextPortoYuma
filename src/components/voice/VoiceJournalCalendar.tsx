/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import toast from "react-hot-toast";
import { getVoiceJournalbyDate, getVoices } from "@/lib/voice";
// import { CloudinaryAudioResource } from "@/types";
import { toLocalDateStringIso } from "@/lib/Time";
import { useUserStore } from "@/store/useUserStore";
import BASE_URL from "@/lib/baseUrl";
import { getJsonWithToken } from "@/lib/fetchLib";
import { withErrorHandler } from "@/lib/withErrorHandler";

const VoiceJournalCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [journalText, setJournalText] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeMonthDates, setActiveMonthDates] = useState<string[]>([]);
  const [cache, setCache] = useState<
    Record<string, { journal: string; audio: string }>
  >({});

  const toLocalIsoString = (date: Date): string => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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

      if (!journalData.data) throw new Error("No voice journal added");

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

  const fetchMonthActiveDates = async (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    try {
      const formattedMonth = `${year}-${month + 2}`;
      const res = await withErrorHandler(
        () => getJsonWithToken(`${BASE_URL}/voice-active/${formattedMonth}`),
        "Failed to get date for voice journal"
      );
      setActiveMonthDates(res);
    } catch (err) {
      console.error("Failed to fetch month active dates", err);
    }
  };

  const isDateLogged = (date: Date) => {
    const iso = toLocalIsoString(date);
    return activeMonthDates.includes(iso);
  };

  const isLastDayOfMonth = (date: Date) => {
    const test = new Date(date);
    test.setDate(test.getDate() + 1);
    return test.getDate() === 1;
  };

  useEffect(() => {
    if (selectedDate) {
      fetchVoiceLog(selectedDate);
      fetchMonthActiveDates(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div className="flex flex-col gap-6 items-center p-6 bg-black bg-opacity-70 rounded-3xl border border-pink-600 shadow-[0_0_30px_#ff00ff] text-pink-300">
      <Calendar
        onChange={(date) => setSelectedDate(date as Date)}
        value={selectedDate}
        showNeighboringMonth={false}
        calendarType="gregory"
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) fetchMonthActiveDates(activeStartDate);
        }}
        className={`react-calendar 
                    w-full max-w-[95vw] sm:max-w-md
                    bg-[#0f001f] text-pink-200
                    rounded-xl p-2 sm:p-4 
                    border border-pink-500 shadow-[0_0_20px_#ff00ff]
                    font-mono text-[12px] sm:text-base`}
        tileClassName={({ date }) => {
          const isToday = date.toDateString() === new Date().toDateString();
          // const isLogged = isDateLogged(date);
          const isSelected =
            selectedDate && date.toDateString() === selectedDate.toDateString();
          const endMonth = isLastDayOfMonth(date);

          const day = date.getDay();
          const dayColorClass =
            day === 0
              ? "text-blue-400"
              : day === 5
              ? "text-green-400"
              : day === 6
              ? "text-purple-400"
              : "";

          return [
            "relative rounded-lg transition-all duration-150 px-1 py-[6px] sm:px-2 sm:py-1 text-xs sm:text-sm",
            isToday &&
              !isSelected &&
              "border border-pink-500 shadow-md text-white",
            isSelected &&
              "bg-cyan-600 text-black font-bold shadow-[0_0_12px_#00ffff] z-10",
            endMonth && "text-yellow-400",
            dayColorClass,
          ]
            .filter(Boolean)
            .join(" ");
        }}
        tileContent={({ date }) =>
          isDateLogged(date) ? (
            <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-2 h-2 bg-pink-400 rounded-full shadow-sm animate-pulse" />
          ) : null
        }
      />
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
