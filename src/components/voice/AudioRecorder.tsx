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
import Transcribe from "./Transcribe";
import useAudioUploadStore from "@/store/audioUploadStore";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [volume, setVolume] = useState(0);
  const [loading, setLoading] = useState(false);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const volumeInterval = useRef<NodeJS.Timeout | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const setUploadedAudio = useAudioUploadStore(
    (state) => state.setUploadedAudio
  );

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
    }
  }, [recordingBlob]);

  const startRecording = async () => {
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
      toast.error(`Microphone access denied: ${err}.`);
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

  const togglePlay = () => {
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
    if (recordingTime < 30) {
      toast.error("Minimum Upload 30s Audio Time Length", {
        duration: 1000,
      });
      return;
    }
    if (!recordingBlob) return;

    const formData = new FormData();
    formData.append("file", recordingBlob, "recording.webm");

    const user = localStorage.getItem("user");
    if (user) {
      formData.append("user", user);
    }

    const uploadPromise = fetch("/api/upload/audio", {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
      setUploadedAudio(data);
    });

    setLoading(true);
    toast
      .promise(uploadPromise, {
        loading: "Uploading audio...",
        success: "Upload successful!",
        error: "Upload failed. Please try again.",
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <div className="flex gap-6 flex-wrap justify-center">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className="flex flex-col items-center transition hover:scale-105"
        >
          {isRecording ? (
            <FaStop size={48} className="text-red-500" />
          ) : (
            <FaMicrophone size={48} className="text-cyan-400" />
          )}
          <span className="mt-1 text-sm font-medium">
            {isRecording ? "Stop" : "Record"}
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
              disabled={loading}
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
          <p className="text-lg font-medium">
            Recording Time: {Math.floor(recordingTime / 60)}:
            {String(recordingTime % 60).padStart(2, "0")}
          </p>
          <div className="w-full max-w-xs h-3 bg-gray-300 rounded overflow-hidden mx-auto">
            <div
              className={`h-full transition-all duration-100`}
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
          <Transcribe />
        </>
      )}
    </div>
  );
};

export default AudioRecorder;
