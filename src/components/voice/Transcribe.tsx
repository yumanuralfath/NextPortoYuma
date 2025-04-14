import useAudioUploadStore from "@/store/audioUploadStore";
import toast from "react-hot-toast";
import { useState } from "react";
import { transcribeAudio } from "@/lib/AssemblyAi";
import TextEditor from "../General/TextEditor";

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
      });
      return;
    }

    setLoading(true);

    try {
      const transcribePromise = transcribeAudio(uploadedAudio.url);

      const TranscribeResult = await toast.promise(transcribePromise, {
        loading: "Transcribing audio...",
        success: "Transcription successful!",
        error: "Transcription failed. Please try again.",
      });

      setResultUploadedAudio(TranscribeResult);
    } catch (err) {
      console.error("Transcription error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (text: string) => {
    toast.success(`${text}`);
    // TODO
    // sementara nanti di save di server
  };

  return (
    <div>
      {!resultUploadedAudio && (
        <button
          type="button"
          disabled={loading}
          className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
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
