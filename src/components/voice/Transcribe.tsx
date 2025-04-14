import useAudioUploadStore from "@/store/audioUploadStore";
import toast from "react-hot-toast";
import { useState } from "react";
import { transcribeAudio } from "@/lib/AssemblyAi";

const Transcribe = () => {
  const { uploadedAudio } = useAudioUploadStore();
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
    const TranscribeResult = await transcribeAudio(uploadedAudio.url);
    setResultUploadedAudio(TranscribeResult);
  };

  return (
    <div>
      <button
        type="button"
        className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        onClick={handleTranscribeClick}
      >
        Transcribe !
      </button>
      {resultUploadedAudio ? (
        <p>Transcribe Result: {resultUploadedAudio}</p>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default Transcribe;
