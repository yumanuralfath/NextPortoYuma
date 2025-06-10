/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  promptService,
  createThread,
  createComment,
  getRandomThreads,
  getCommentbyThreadID,
} from "@/lib/alfathai";
import { useEffect, useState, ChangeEvent, FormEvent, useRef } from "react"; // Tambahkan useRef
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import AuthModal from "../General/AuthModal";
import { getAccessToken } from "@/lib/fetchLib";

interface PromptInput {
  prompt: string;
}

interface Thread {
  id: number;
  content: string;
}

const ChatboxPage = () => {
  const [promptInput, setPromptInput] = useState<PromptInput>({ prompt: "" });
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [selectedComment, setSelectedComment] = useState<string>("");
  const [expandedThreadId, setExpandedThreadId] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [awaitingAuth, setAwaitingAuth] = useState<boolean>(false);
  const lastPromptRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await getRandomThreads();
        setThreads(res.threads.slice(0, 6));
      } catch (error: any) {
        toast.error(`Gagal memuat thread acak: ${error.message || error}`);
      }
    };

    fetchThreads();
  }, []);

  // // Efek untuk memicu pengiriman ulang setelah otentikasi berhasil
  // useEffect(() => {
  //   // Jika modal ditutup (showAuthModal false) dan kita sedang menunggu auth, dan ada prompt yang disimpan
  //   if (!showAuthModal && awaitingAuth && lastPromptRef.current) {
  //     setAwaitingAuth(false); // Reset status menunggu auth
  //     // Panggil kembali handleSubmit (simulasi submit form)
  //     // Kita perlu membuat fungsi async terpisah karena useEffect tidak bisa langsung async
  //     const reattemptSubmit = async () => {
  //       const promptToResubmit = lastPromptRef.current;
  //       lastPromptRef.current = null; // Hapus prompt yang disimpan

  //       if (promptToResubmit) {
  //         // Atur kembali promptInput dan panggil handleSubmit
  //         setPromptInput({ prompt: promptToResubmit });
  //         // Kita tidak bisa langsung memanggil handleSubmit(e) karena tidak ada event.
  //         // Kita akan memanggil logika inti handleSubmit secara manual.
  //         await handleActualSubmit(promptToResubmit);
  //       }
  //     };
  //     reattemptSubmit();
  //   }
  // }, [showAuthModal, awaitingAuth]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPromptInput({ ...promptInput, [e.target.id]: e.target.value });
  };

  const handleActualSubmit = async (promptContent: string) => {
    setLoading(true);
    setResponse("");
    setSelectedComment("");
    setSelectedThread(null);
    setPromptInput({ prompt: promptContent });

    try {
      const thread = await createThread(promptContent);
      const threadId = thread.id;

      const data = await promptService({ prompt: promptContent });
      const aiResponse = data?.content || "Tidak ada respons dari AI";
      setResponse(aiResponse);
      setPromptInput({ prompt: "" });

      await createComment(threadId, aiResponse);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan yang tidak diketahui";

      toast.error(errorMessage);

      if (errorMessage.includes("Token tidak ditemukan. Silakan login.")) {
        lastPromptRef.current = promptContent;
        setAwaitingAuth(true);
        setAuthMode("login");
        setShowAuthModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!promptInput.prompt.trim()) {
      toast.error("Please input Something bro");
      return;
    }
    const token = getAccessToken();
    if (!token) {
      lastPromptRef.current = promptInput.prompt;
      setAuthMode("login");
      setShowAuthModal(true);
      setAwaitingAuth(true);
      return;
    }

    if (awaitingAuth) return;

    await handleActualSubmit(promptInput.prompt);
  };

  const handleThreadClick = async (thread: Thread) => {
    setLoading(true);
    setSelectedComment("");
    setSelectedThread(thread);
    setResponse("");
    setPromptInput({ prompt: "" });

    try {
      const res = await getCommentbyThreadID(thread.id);
      const comment =
        res.comments?.[0]?.content || "Tidak ada response silahkan chat ulang";
      setSelectedComment(comment);
    } catch (error: any) {
      toast.error(`Gagal memuat komentar thread: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6">
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => {
            setShowAuthModal(false);
            if (awaitingAuth && !lastPromptRef.current) {
              setAwaitingAuth(false);
            }
          }}
          onSuccessLogin={() => {
            setShowAuthModal(false);
            const promptToResubmit = lastPromptRef.current;
            lastPromptRef.current = null;
            setAwaitingAuth(false);

            if (promptToResubmit) {
              handleActualSubmit(promptToResubmit);
            }
          }}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}

      {/* Threads */}
      <div className="flex flex-wrap gap-2 mb-6">
        {threads.map((thread) => (
          <div key={thread.id} className="flex flex-col items-start">
            <button
              onClick={() => {
                handleThreadClick(thread);
                setExpandedThreadId((prev) =>
                  prev === thread.id ? null : thread.id
                );
              }}
              className={`truncate px-4 py-2 text-sm rounded-full btn-cyber ${
                selectedThread?.id === thread.id ? "bg-cyan-400 text-black" : ""
              }`}
            >
              {thread.content.length > 15
                ? `${thread.content.slice(0, 15)}...`
                : thread.content}
            </button>

            {expandedThreadId === thread.id && (
              <div className="mt-1 text-sm text-cyan-300 max-w-xs break-words bg-cyberpunk-panel panel-shadow px-3 py-2 rounded">
                {thread.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          id="prompt"
          type="text"
          value={promptInput.prompt}
          onChange={handleChange}
          placeholder="Please Input here..."
          className="p-3 rounded-md input-cyber"
        />
        <button
          type="submit"
          disabled={loading || awaitingAuth}
          className="btn-cyber py-2 px-4 rounded-md disabled:opacity-40"
        >
          {loading
            ? "Loading..."
            : awaitingAuth
            ? "Menunggu Login..."
            : "Kirim"}
        </button>
      </form>

      {/* Loading */}
      {loading && (
        <div className="mt-6 flex flex-col items-center justify-center text-center space-y-3">
          <Image
            src="/loading.gif"
            alt="Loading..."
            width={220}
            height={220}
            className="mx-auto"
          />
          <p className="text-sm text-neon-purple">Please Wait Brother...</p>
        </div>
      )}

      {/* AI Response */}
      {!loading && (response || selectedComment) && (
        <div className="mt-6 p-4 rounded-md bg-cyberpunk-panel panel-shadow">
          <h2 className="text-lg font-bold mb-2 text-neon-purple">
            💬 Respons:
          </h2>
          <div className="prose prose-sm text-neon-blue max-w-none break-words">
            <ReactMarkdown>{response || selectedComment}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatboxPage;
