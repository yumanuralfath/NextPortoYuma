import useAudioUploadStore from "@/store/audioUploadStore";
import toast from "react-hot-toast";
import { useState } from "react";
import { transcribeAudio } from "@/lib/AssemblyAi";
import TextEditor from "../General/TextEditor";
import { SaveVoiceJournalLog } from "@/lib/voice";

interface TranscribeProps {
  onSaveSuccess?: () => void;
}

const Transcribe = ({ onSaveSuccess }: TranscribeProps) => {
  const { uploadedAudio } = useAudioUploadStore();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [transcribedText, setTranscribedText] = useState<
    string | null | undefined
  >(null);

  const handleTranscribeClick = async () => {
    if (!uploadedAudio) {
      toast.error("Please Upload Your Audio First!", {
        duration: 2000,
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

    setIsTranscribing(true);

    try {
      const transcribePromise = transcribeAudio(uploadedAudio.url);

      const result = await toast.promise(
        transcribePromise,
        {
          loading: "Audio Transcription...",
          success: "Transcription Success",
          error: "Transcription Failed. Please try again.",
        },
        {
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

      setTranscribedText(result);
    } catch (err) {
      console.error("Transcription Error", err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSave = async (voice_journal: string) => {
    setIsSaving(true);
    try {
      const savePromise = SaveVoiceJournalLog(voice_journal);

      await toast.promise(
        savePromise,
        {
          loading: "Voice Log Saving...",
          success: "Save Succesfull",
          error: (err) =>
            err.message || "Save Failed, Today entry already exist.",
        },
        {
          duration: 2000,
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
      onSaveSuccess?.();
    } catch (err) {
      console.error(`Voice Journal error for save: ${err}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {transcribedText === null && (
        <button
          type="button"
          disabled={isTranscribing}
          className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:opacity-60 disabled:cursor-wait"
          onClick={handleTranscribeClick}
        >
          {isTranscribing ? "Mentranskripsi..." : "Transkripsikan !"}
        </button>
      )}

      {transcribedText !== null && (
        <TextEditor
          initialText={transcribedText}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default Transcribe;
