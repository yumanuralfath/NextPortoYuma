/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getVoiceJournalbyDate, getVoices } from "@/lib/voice";
import { toLocalDateStringIso, getFormattedMonth } from "@/lib/Time";
import { useUserStore } from "@/store/useUserStore";
import BASE_URL from "@/lib/baseUrl";
import { getJsonWithToken } from "@/lib/fetchLib";
import { withErrorHandler } from "@/lib/withErrorHandler";
import CalendarDisplay from "./CalenderDisplay";
import JournalViewer from "./JournalViewer";

const VoiceJournalCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [journalText, setJournalText] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeMonthDates, setActiveMonthDates] = useState<string[]>([]);
  const [lastFetchedMonth, setLastFetchedMonth] = useState<string | null>(null);
  const [cache, setCache] = useState<
    Record<string, { journal: string; audio: string; voiceActive: string[] }>
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
      if (!userData) throw new Error("User not found");

      const UserID = userData.id.toString();
      const [journalData, voices] = await Promise.all([
        getVoiceJournalbyDate(isoDate),
        getVoices(UserID, isoDate),
      ]);

      if (!journalData.data) throw new Error(journalData.message);

      const journalText = journalData.data.voices_journal;
      const audio = voices.length > 0 ? voices[0].secure_url : "";

      setJournalText(journalText);
      setAudioUrl(audio);
      setCache((prev) => ({
        ...prev,
        [isoDate]: {
          journal: journalText,
          audio,
          voiceActive: prev[isoDate]?.voiceActive ?? [],
        },
      }));
    } catch (error: any) {
      setJournalText(null);
      setAudioUrl(null);
      toast.error(error.message || "Failed to fetch voice journal.", {
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
    const formattedMonth = getFormattedMonth(date);
    if (formattedMonth === lastFetchedMonth) return;

    try {
      const res = await withErrorHandler(
        () => getJsonWithToken(`${BASE_URL}/voice-active/${formattedMonth}`),
        "Failed to get date for voice journal"
      );
      setActiveMonthDates(res);
      setLastFetchedMonth(formattedMonth);
    } catch (err) {
      console.error("Failed to fetch month active dates", err);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchVoiceLog(selectedDate);
      fetchMonthActiveDates(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div className="flex flex-col gap-6 items-center p-6 bg-black bg-opacity-70 rounded-3xl border border-pink-600 shadow-[0_0_30px_#ff00ff] text-pink-300">
      <CalendarDisplay
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        activeDates={activeMonthDates}
      />
      <JournalViewer
        loading={loading}
        audioUrl={audioUrl}
        journalText={journalText}
      />
    </div>
  );
};

export default VoiceJournalCalendar;
