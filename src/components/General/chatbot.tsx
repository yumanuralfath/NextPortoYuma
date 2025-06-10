import { useState } from "react";
import { usePathname } from "next/navigation";
import ChatboxPage from "../alfathai/chatbox";
import Image from "next/image";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  if (pathname?.startsWith("/app")) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[1000]">
      <div
        className={`
          fixed bottom-20 right-4 z-[1001] flex flex-col overflow-hidden border
          transition-all duration-300 ease-in-out

          bg-[linear-gradient(145deg,#0f0f0f,#1a1a1a)] border-[#00f0ff]
          shadow-[0_0_10px_#00f0ff66,0_0_20px_#aa00ff33]

          @media (min-device-width: 71mm) and (max-device-height: 152mm)
          sm:w-[400px] sm:h-[600px] sm:rounded-2xl

          // Tambahkan tinggi untuk layar kecil (smartphone) di sini
          w-[calc(100vw-2rem)] h-[calc(100vh-8rem)] max-h-[600px] rounded-xl

          ${
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-90 pointer-events-none"
          }
        `}
      >
        <div className="flex items-center justify-between border-b border-[#00f0ff]/50 bg-black/30 p-4">
          <h2 className="text-lg font-bold text-[#00f0ff] drop-shadow-[0_0_5px_#00f0ff]">
            A.I. Assistant
          </h2>
          <button
            onClick={toggleChat}
            className="rounded-md p-1 text-2xl text-[#00f0ff] transition-all hover:bg-[#00f0ff] hover:text-black hover:shadow-[0_0_10px_#00f0ff]"
            aria-label="Tutup Chat"
          >
            &times;
          </button>
        </div>

        <div className="flex-grow overflow-y-auto bg-[#0d0d0d] p-4 shadow-[inset_0_0_10px_#00f0ff33]">
          <ChatboxPage />
        </div>
      </div>

      <button
        onClick={toggleChat}
        className="
          flex h-20 w-20 items-center justify-center rounded-full border bg-[#0f0f0f] text-[#00f0ff]
          border-[#00f0ff] shadow-[0_0_5px_#00f0ff66]
          transition-all duration-300 ease-in-out hover:bg-[#00f0ff] hover:text-black hover:shadow-[0_0_10px_#00f0ffcc]"
        aria-label="Buka Chat"
      >
        <Image
          height={100}
          width={100}
          unoptimized
          src="/miku-wave.gif"
          alt="Chatbot Icon"
          className="drop-shadow-[0_0_6px_#ff00ff]"
        />
      </button>
    </div>
  );
};

export default Chatbot;
