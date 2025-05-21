/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  promptService,
  createThread,
  createComment,
  getRandomThreads,
  getCommentbyThreadID,
} from "@/lib/alfathai";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

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

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await getRandomThreads();
        setThreads(res.threads.slice(0, 6));
      } catch (error: any) {
        toast.error(`Gagal memuat thread acak: ${error}`, error);
      }
    };

    fetchThreads();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPromptInput({ ...promptInput, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!promptInput.prompt.trim()) {
      toast.error("Prompt tidak boleh kosong");
      return;
    }

    setLoading(true);
    setResponse("");
    setSelectedComment("");
    setSelectedThread(null);

    try {
      const thread = await createThread(promptInput.prompt);
      const threadId = thread.id;

      const data = await promptService(promptInput);
      const aiResponse = data?.content || "Tidak ada respons dari AI";
      setResponse(aiResponse);

      await createComment(threadId, aiResponse);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan yang tidak diketahui"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleThreadClick = async (thread: Thread) => {
    setLoading(true);
    setSelectedComment("");
    setSelectedThread(thread);
    setResponse("");

    try {
      const res = await getCommentbyThreadID(thread.id);
      const comment =
        res.comments?.[0]?.content || "Tidak ada response silahkan chat ulang";
      setSelectedComment(comment);
    } catch (error: any) {
      toast.error(`Gagal memuat komentar thread: ${error}`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6">
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
          placeholder="Masukkan prompt disini..."
          className="p-3 rounded-md input-cyber"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-cyber py-2 px-4 rounded-md disabled:opacity-40"
        >
          {loading ? "Membuka kanal AI..." : "Kirim ke AI"}
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
          <p className="text-sm text-neon-purple">
            Memanggil AI dari dimensi lain...
          </p>
        </div>
      )}

      {/* AI Response */}
      {!loading && (response || selectedComment) && (
        <div className="mt-6 p-4 rounded-md bg-cyberpunk-panel panel-shadow">
          <h2 className="text-lg font-bold mb-2 text-neon-purple">
            💬 Respons AI:
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
