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
        "Sorry, we couldn't hear anything. Please record again.",
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
    }
    return transcript.text;
  } catch (error) {
    toast.error(`Transcription error: ${error.message || error}`, {
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
    throw error;
  }
};
