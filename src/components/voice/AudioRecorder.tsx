/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import WaveSurfer from "wavesurfer.js";
import {
  FaMicrophone,
  FaPlay,
  FaStop,
  FaDownload,
  FaPause,
  FaUpload,
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import Transcribe from "./Transcribe";
import ReRecordToastContent from "./ReRecordToastContent";
import useAudioUploadStore from "@/store/audioUploadStore";
import { User } from "@/types";
import { getVoices, deleteVoices } from "@/lib/voice";
import { CloudinaryAudioResource } from "@/types";
import DeleteReRecordToast from "./DeleteRecordToast";
import { useUserStore } from "@/store/useUserStore";

interface AudioRecorderProps {
  onRecordingStateChange?: (hasRecording: boolean) => void;
  onSaveSuccess?: () => void;
}

const AudioRecorder = ({
  onRecordingStateChange,
  onSaveSuccess,
}: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [volume, setVolume] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [voicesLoading, setVoicesLoading] = useState(true);
  const [voices, setVoices] = useState<CloudinaryAudioResource[]>([]);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [hasUploadedToday, setHasUploadedToday] = useState(false);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const volumeInterval = useRef<NodeJS.Timeout | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const setUploadedAudio = useAudioUploadStore(
    (state) => state.setUploadedAudio
  );

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const fetchUserAndVoices = async () => {
    setVoicesLoading(true);
    try {
      let userData = user;
      if (!userData) {
        const fetchedUser = useUserStore.getState().user;
        if (!fetchedUser) throw new Error("User not found");
        setUser(fetchedUser);
        userData = fetchedUser;
      }
      if (!userData) throw new Error("User data is null");
      const today = new Date().toISOString().slice(0, 10);
      const response = await getVoices(userData.id.toString(), today);
      setVoices(response);
      setHasUploadedToday(response.length > 0);
      if (response.length > 0) {
        localStorage.setItem("lastUploadDate", today);
      } else {
        localStorage.removeItem("lastUploadDate");
      }
    } catch (err) {
      console.error("Error fetching voices:", err);
    } finally {
      setVoicesLoading(false);
    }
  };

  useEffect(() => {
    if (onRecordingStateChange) {
      onRecordingStateChange(recordingBlob !== null);
    }
  }, [recordingBlob]);

  useEffect(() => {
    const stored = localStorage.getItem("lastUploadDate");
    const todayStr = new Date().toISOString().slice(0, 10);
    if (stored === todayStr) {
      setHasUploadedToday(true);
      fetchUserAndVoices();
    } else {
      fetchUserAndVoices();
    }
  }, []);

  useEffect(() => {
    if (recordingBlob && waveformRef.current) {
      const url = URL.createObjectURL(recordingBlob);

      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }

      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#7c5ce0",
        progressColor: "#c93daa",
        height: 100,
      });

      wavesurfer.current.load(url);

      wavesurfer.current.on("finish", () => {
        setIsPlaying(false);
      });

      wavesurfer.current.on("audioprocess", () => {
        const currentTime = wavesurfer.current?.getCurrentTime() || 0;
        setPlaybackTime(currentTime);
      });

      (wavesurfer.current as any).on("seek", () => {
        const currentTime = wavesurfer.current?.getCurrentTime() || 0;
        setPlaybackTime(currentTime);
      });

      wavesurfer.current.on("ready", () => {
        const currentTime = wavesurfer.current?.getCurrentTime() || 0;
        setPlaybackTime(currentTime);
      });
    }
  }, [recordingBlob]);

  const handleUploadSuccess = () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem("lastUploadDate", today);
    setHasUploadedToday(true);
  };

  const doUpload = async () => {
    if (!recordingBlob) throw new Error("No recording to upload");
    const formData = new FormData();
    formData.append("file", recordingBlob as Blob, "recording.webm");
    if (user) {
      formData.append("user", JSON.stringify(user));
    }

    setLoading(true);
    try {
      const res = await fetch("/api/upload/audio", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUploadedAudio(data);
      await fetchUserAndVoices();
      handleUploadSuccess();
    } catch (err: any) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    if (hasUploadedToday) {
      toast.custom(
        (t) => (
          <DeleteReRecordToast
            t={t}
            user={user}
            onSuccess={() => {
              setVoices([]);
              setHasUploadedToday(false);
            }}
          />
        ),
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
      return;
    }

    if (recordingBlob) {
      toast.custom(
        (t) => (
          <ReRecordToastContent
            t={t}
            canUpload={recordingTime >= 20}
            onUpload={uploadRecording}
            onReRecord={() => {
              setRecordingBlob(null);
              setRecordingTime(0);
              setPlaybackTime(0);
              if (wavesurfer.current) {
                wavesurfer.current.destroy();
                wavesurfer.current = null;
              }
            }}
          />
        ),
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
      return;
    }

    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setStream(userStream);

      const mediaRecorder = new MediaRecorder(userStream);
      setRecorder(mediaRecorder);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const completeBlob = new Blob(chunks, { type: "audio/webm" });
        setRecordingBlob(completeBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Volume meter setup
      audioContext.current = new AudioContext();
      const source = audioContext.current.createMediaStreamSource(userStream);
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 256;

      source.connect(analyser.current);

      const dataArray = new Uint8Array(analyser.current.frequencyBinCount);

      volumeInterval.current = setInterval(() => {
        analyser.current!.getByteFrequencyData(dataArray);
        const avg =
          dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
        setVolume(avg);
      }, 100);

      // Timer
      timerInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      toast.error(`Microphone access denied: ${err}.`, {
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
    }
  };

  const stopRecording = () => {
    if (recorder) recorder.stop();
    if (stream) stream.getTracks().forEach((track) => track.stop());
    if (audioContext.current) audioContext.current.close();

    if (volumeInterval.current) clearInterval(volumeInterval.current);
    if (timerInterval.current) clearInterval(timerInterval.current);

    setIsRecording(false);
    setVolume(0);
  };

  const togglePlay = async () => {
    if (!recordingBlob) return;
    if (!wavesurfer.current) return;
    wavesurfer.current.playPause();
    setIsPlaying(!isPlaying);
  };

  const downloadBlob = () => {
    if (!recordingBlob) return;
    const url = URL.createObjectURL(recordingBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.webm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const uploadRecording = async () => {
    if (isUploading) return;
    if (recordingTime < 20) {
      toast.error("Minimum Upload 20s Audio Time Length", {
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
    if (!recordingBlob) return;
    if (hasUploadedToday) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } fixed top-4 right-50 z-50`}
        >
          <div className="flex flex-col space-y-4 p-4 bg-[#1a001a] border-2 border-pink-600 rounded-xl shadow-[0_0_20px_#ff00ff] text-pink-300 font-mono w-96 max-w-[90vw]">
            <span className="text-pink-400 text-sm text-center">
              ⚠️ You already uploaded a voice recording today.
            </span>
            <span className="text-sm text-center">
              Do you want to delete it and re-record?
            </span>
            <div className="flex justify-around">
              <button
                disabled={isUploading}
                onClick={async () => {
                  if (isUploading) return;
                  try {
                    setIsUploading(true);
                    if (!user) {
                      toast.error("User not found", {
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
                    const createdAt = new Date(voices[0].created_at);
                    const date = createdAt.toISOString().split("T")[0];
                    const deleted = await deleteVoices(
                      user.id.toString(),
                      date
                    );
                    setVoices([]);
                    setHasUploadedToday(false);
                    localStorage.removeItem("lastUploadDate");
                    toast.dismiss(t.id);
                    toast.success(
                      `Recording deleted (${deleted}). You can now record again.`,
                      {
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
                      }
                    );
                    // Reset blob/playback if needed:
                    setRecordingBlob(null);
                    setRecordingTime(0);
                    setPlaybackTime(0);
                    if (wavesurfer.current) {
                      wavesurfer.current.destroy();
                      wavesurfer.current = null;
                    }
                  } catch (error: any) {
                    console.error(error);
                    toast.error(
                      `Failed to delete previous recording. ${
                        error.message || error
                      }`,
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
                  } finally {
                    setIsUploading(false);
                  }
                }}
                className={`${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                } bg-pink-600 text-black font-bold px-4 py-2 rounded hover:bg-pink-500 transition duration-300 shadow-[0_0_10px_#ff00ff]`}
              >
                {isUploading ? "Deleting..." : "Delete & Re-record"}
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="bg-gray-600 text-white font-bold px-4 py-2 rounded hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ));
      return;
    }

    setIsUploading(true);
    toast
      .promise(
        doUpload(),
        {
          loading: "Uploading audio...",
          success: "Upload successful!",
          error: "Upload failed. Please try again.",
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
      )
      .finally(() => {
        setIsUploading(false);
      });
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <div className="flex gap-6 flex-wrap justify-center">
        <button
          onClick={
            voicesLoading
              ? undefined
              : isRecording
              ? stopRecording
              : startRecording
          }
          disabled={voicesLoading}
          className={`flex flex-col items-center transition hover:scale-105 ${
            voicesLoading || hasUploadedToday
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {voicesLoading ? (
            <ImSpinner2 size={48} className="text-gray-400 animate-spin" />
          ) : isRecording ? (
            <FaStop size={48} className="text-red-500" />
          ) : (
            <FaMicrophone size={48} className="text-cyan-400" />
          )}
          <span className="mt-1 text-sm font-medium">
            {voicesLoading
              ? "Loading..."
              : isRecording
              ? "Stop"
              : hasUploadedToday
              ? "Recorded"
              : "Record"}
          </span>
        </button>

        {recordingBlob && (
          <>
            <button
              onClick={togglePlay}
              className="flex flex-col items-center transition hover:scale-105"
            >
              {isPlaying ? (
                <FaPause size={48} className="text-orange-400" />
              ) : (
                <FaPlay size={48} className="text-green-400" />
              )}
              <span className="mt-1 text-sm font-medium">
                {isPlaying ? "Pause" : "Play"}
              </span>
            </button>

            <button
              onClick={downloadBlob}
              className="flex flex-col items-center transition hover:scale-105"
            >
              <FaDownload size={48} className="text-teal-400" />
              <span className="mt-1 text-sm font-medium">Download</span>
            </button>

            <button
              onClick={uploadRecording}
              disabled={
                loading || isUploading || voicesLoading || hasUploadedToday
              }
              className="flex flex-col items-center transition hover:scale-105"
            >
              <FaUpload size={48} className="text-blue-500" />
              <span className="mt-1 text-sm font-medium">
                {loading ? "Uploading..." : "Upload"}
              </span>
            </button>
          </>
        )}
      </div>

      {isRecording && (
        <div className="text-center space-y-2">
          <div className="text-3xl font-mono text-cyan-300 bg-gray-900 px-3 py-2 rounded-lg shadow-md inline-block">
            {formatTime(recordingTime)}
          </div>
          <div className="w-full max-w-xs h-3 bg-gray-300 rounded overflow-hidden mx-auto">
            <div
              className="h-full transition-all duration-100"
              style={{
                width: `${Math.min(volume, 100)}%`,
                backgroundColor: volume > 60 ? "red" : "#61dafb",
              }}
            />
          </div>
        </div>
      )}

      {recordingBlob && (
        <>
          <div
            ref={waveformRef}
            className="w-full max-w-3xl mt-6 border-t border-gray-200 pt-4"
          />
          <div className="text-3xl font-mono text-green-300 bg-gray-900 px-3 py-2 rounded-lg shadow-md inline-block mt-2">
            {formatTime(playbackTime)}
          </div>
          <Transcribe onSaveSuccess={onSaveSuccess} />
        </>
      )}
    </div>
  );
};

export default AudioRecorder;
