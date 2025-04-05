import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import WaveSurfer from "wavesurfer.js";
import {
  FaMicrophone,
  FaPlay,
  FaStop,
  FaDownload,
  FaPause,
} from "react-icons/fa";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [volume, setVolume] = useState(0);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const volumeInterval = useRef<NodeJS.Timeout | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

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

  return (
    <div>
      <div style={{ margin: "1rem" }}>
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? (
            <FaStop size={48} color="red" />
          ) : (
            <FaMicrophone size={48} color="#61dafb" />
          )}{" "}
          {isRecording ? "Stop" : "Start"}
        </button>{" "}
        {recordingBlob && (
          <>
            <button onClick={togglePlay}>
              {isPlaying ? (
                <FaPause size={48} color="#ed9418" />
              ) : (
                <FaPlay size={48} color="#81f760" />
              )}{" "}
              {isPlaying ? "Pause" : "Play"}
            </button>{" "}
            <button onClick={downloadBlob}>
              <FaDownload size={48} color="#18edad" /> Download
            </button>
          </>
        )}
      </div>

      {isRecording && (
        <>
          <p>
            Recording Time: {Math.floor(recordingTime / 60)}:
            {String(recordingTime % 60).padStart(2, "0")}
          </p>
          <div
            style={{
              width: "100%",
              height: "10px",
              background: "#ccc",
              borderRadius: "5px",
              margin: "1rem auto",
              maxWidth: "300px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(volume, 100)}%`,
                background: volume > 60 ? "red" : "#61dafb",
                transition: "width 0.1s",
              }}
            />
          </div>
        </>
      )}

      <div ref={waveformRef} style={{ marginTop: "30px" }} />
    </div>
  );
};

export default AudioRecorder;
