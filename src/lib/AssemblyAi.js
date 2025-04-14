import { AssemblyAI } from "assemblyai";
import toast from "react-hot-toast";

const client = new AssemblyAI({
  // eslint-disable-next-line no-undef
  apiKey: process.env.NEXT_PUBLIC_ASSEMBLY_AI_API_KEY,
});

export const transcribeAudio = async (FILE_URL) => {
  const data = {
    audio: FILE_URL,
    speech_model: "nano",
    language_detection: true,
  };

  try {
    const transcript = await client.transcripts.transcribe(data);
    if (transcript.text === "") {
      return toast.error(
        "Sorry, we couldn't hear anything. Please record again."
      );
    }
    return transcript.text;
  } catch (error) {
    toast.error(`Transcription error: ${error.message || error}`);
    throw error;
  }
};
