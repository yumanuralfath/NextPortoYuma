import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ChatboxPage from "../alfathai/chatbox";
import Image from "next/image";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      setShowGreeting(true);
    }, 1500);

    const greetingTimeout = setTimeout(() => {
      setShowGreeting(false);
    }, 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(greetingTimeout);
    };
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (showGreeting) {
      setShowGreeting(false);
    }
  };

  if (pathname?.startsWith("/app")) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[1000]">
      <div
        className={`
          fixed bottom-24 right-4 z-[1001] flex flex-col overflow-hidden rounded-2xl border
          bg-[linear-gradient(145deg,#0f0f0f,#1a1a1a)] text-white
          shadow-[0_0_15px_#00f0ff88,0_0_30px_#aa00ff55]
          transition-all duration-300 ease-in-out
          border-[#00f0ff]
          w-[calc(100vw-2rem)] h-[70vh] max-w-[400px] sm:h-[500px]
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

      {/* Gelembung Sapaan */}
      {showGreeting && !isOpen && (
        <div
          className="
            absolute bottom-20 right-0 mb-2 w-max animate-fade-in-up rounded-lg
            bg-[#00f0ff] p-3 text-black shadow-lg transition-all duration-500
          "
        >
          <p className="text-sm font-semibold">
            Halo! Ada yang bisa saya bantu?
          </p>
          <div
            className="
              absolute bottom-[-8px] right-5 h-4 w-4 rotate-45
              bg-[#00f0ff]
            "
          ></div>
        </div>
      )}

      <button
        onClick={toggleChat}
        className="
          group relative flex h-16 w-16 items-center justify-center rounded-full
          border-2 border-[#00f0ff] bg-[#0f0f0f]
          text-[#00f0ff] shadow-[0_0_8px_#00f0ff99]
          transition-all duration-300 ease-in-out
          hover:bg-[#00f0ff] hover:text-black hover:shadow-[0_0_15px_#00f0ffcc]
        "
        aria-label="Buka Chat"
      >
        <Image
          height={80}
          width={80}
          src="/miku-wave.webp"
          alt="Chatbot Icon"
          className="
            rounded-full drop-shadow-[0_0_6px_#ff00ff]
            transition-transform duration-300 group-hover:scale-110
          "
        />
      </button>
    </div>
  );
};

export default Chatbot;
