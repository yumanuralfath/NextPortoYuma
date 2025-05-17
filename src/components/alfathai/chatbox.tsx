"use client";

import { promptService, createThread, createComment } from "@/lib/alfathai";
import { useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import Image from "next/image";


interface PromptInput {
  prompt: string;
}

const ChatboxPage = () => {
  const [promptInput, setPromptInput] = useState<PromptInput>({
    prompt: "",
  });

  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPromptInput({
      ...promptInput,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!promptInput.prompt.trim()) {
      toast.error("Prompt tidak boleh kosong");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const thread = await createThread(promptInput.prompt);
      const threadId = thread.id;

      const data = await promptService(promptInput);
      const aiResponse = data?.content || "Tidak ada respons dari AI";
      setResponse(aiResponse);

      await createComment(threadId, aiResponse);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          id="prompt"
          type="text"
          value={promptInput.prompt}
          onChange={handleChange}
          placeholder="Ketik prompt di sini..."
          className="p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}

          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all duration-150"
        >
          {loading ? "Mengirim..." : "Kirim"}
        </button>
      </form>

      {loading && (
        <div className="mt-6 flex flex-col items-center justify-center text-center space-y-3">
          <Image
            src="/loading.gif"
            alt="Loading..."
            width={280}
            height={280}
            className="mx-auto"
          />
          <p className="text-sm text-gray-600">
            Silahkan menunggu antara 1 - 2 menit, terima kasih.
          </p>
        </div>
      )}

      {response && !loading && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50 shadow-sm">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Respons:</h2>
          <div className="prose prose-sm max-w-none text-gray-700">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatboxPage;
