import useAudioUploadStore from "@/store/audioUploadStore";
import toast from "react-hot-toast";
import { useState } from "react";
import { transcribeAudio } from "@/lib/AssemblyAi";
import TextEditor from "../General/TextEditor";
import { SaveVoiceJournalLog } from "@/lib/voice";

const Transcribe = () => {
  const { uploadedAudio } = useAudioUploadStore();
  const [loading, setLoading] = useState(false);
  const [resultUploadedAudio, setResultUploadedAudio] = useState<
    string | null | undefined
  >(null);

  const handleTranscribeClick = async () => {
    if (!uploadedAudio) {
      toast.error("Please upload your audio first!", {
        duration: 1000,
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
      return;
    }

    setLoading(true);

    try {
      const transcribePromise = transcribeAudio(uploadedAudio.url);

      const TranscribeResult = await toast.promise(
        transcribePromise,
        {
          loading: "Transcribing audio...",
          success: "Transcription successful!",
          error: "Transcription failed. Please try again.",
        },
        {
          duration: 1000,
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
        }
      );

      setResultUploadedAudio(TranscribeResult);
    } catch (err) {
      console.error("Transcription error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (voice_journal: string) => {
    setLoading(true);
    try {
      const handleSavePromise = SaveVoiceJournalLog(voice_journal);

      await toast.promise(
        handleSavePromise,
        {
          loading: "Saving Voice Log....",
          success: "Save Succesfull!",
        },
        {
          duration: 1000,
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
        }
      );
    } catch (err) {
      console.error(`error to save voice journal: ${err}`);
      toast.error("Voice Journal Failed to save, already exist for today", {
        duration: 3000,
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

  return (
    <div>
      {!resultUploadedAudio && (
        <button
          type="button"
          disabled={loading}
          className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-3 py-2.5 text-center me-2 mb-2"
          onClick={handleTranscribeClick}
        >
          {loading ? "Transcribing..." : "Transcribe !"}
        </button>
      )}

      {resultUploadedAudio && (
        <TextEditor initialText={resultUploadedAudio} onSave={handleSave} />
      )}
    </div>
  );
};

export default Transcribe;
