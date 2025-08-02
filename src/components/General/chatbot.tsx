"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X } from "lucide-react";
import { faq } from "@/content/faq";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { promptService } from "@/lib/alfathai";

interface Message {
  text: string;
  isUser: boolean;
}

const ThinkingBubble = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-2"
  >
    <Bot className="w-6 h-6 text-blue-500 flex-shrink-0" />
    <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-4 py-3 flex items-center space-x-1">
      <motion.span
        className="w-2 h-2 bg-gray-500 rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="w-2 h-2 bg-gray-500 rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{
          delay: 0.2,
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.span
        className="w-2 h-2 bg-gray-500 rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{
          delay: 0.4,
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  </motion.div>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const notificationTimer = setTimeout(() => {
      if (!isOpen && messages.length === 0) {
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 8000);
      }
    }, 3000);
    return () => clearTimeout(notificationTimer);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeTimer = setTimeout(() => {
        setMessages([
          {
            text: "Halo! Saya asisten AI Yuma. Apa yang ingin Anda ketahui? Anda bisa memilih salah satu pertanyaan di bawah atau ajukan pertanyaan Anda sendiri.",
            isUser: false,
          },
        ]);
      }, 500);
      return () => clearTimeout(welcomeTimer);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleFaqClick = (question: string, answer: string) => {
    setMessages((prev) => [
      ...prev,
      { text: question, isUser: true },
      { text: answer, isUser: false },
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { text: inputValue, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsThinking(true);

    try {
      const response = await promptService({ prompt: inputValue });
      const aiMessage: Message = { text: response.content, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        text: `Maaf, terjadi kesalahan saat menghubungi AI: ${error} . Silakan coba lagi.`,
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleOpenChat = () => {
    setIsOpen(!isOpen);
    if (showNotification) {
      setShowNotification(false);
    }
  };

  // Cek apakah user pernah mengetik sendiri (bukan hanya klik FAQ)
  const hasTypedManually = messages.some(
    (msg) => msg.isUser && !faq.some((f) => f.question === msg.text)
  );

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <AnimatePresence>
          {showNotification && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-20 right-0 max-w-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl px-4 py-3 shadow-md border border-gray-200 dark:border-gray-700 flex items-center gap-2"
            >
              <Bot className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span className="text-sm">Hai! 👋 Butuh bantuan?</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <Button
            onClick={handleOpenChat}
            className={cn(
              "rounded-full w-16 h-16 text-white shadow-lg transition-all duration-300 ease-in-out",
              "bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700",
              "dark:from-purple-500 dark:to-blue-600 dark:hover:from-purple-600 dark:hover:to-blue-700",
              "hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            )}
          >
            {isOpen ? <X size={30} /> : <Bot size={30} />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-24 right-5 w-80 md:w-96 h-[70vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl flex flex-col z-50"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Asisten AI
              </h3>
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 p-4 space-y-4 overflow-y-auto"
            >
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex items-end gap-2", {
                    "justify-end": msg.isUser,
                  })}
                >
                  {!msg.isUser && (
                    <Bot className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  )}
                  <div
                    className={cn("rounded-lg px-4 py-2 max-w-[80%] text-sm", {
                      "bg-blue-500 text-white": msg.isUser,
                      "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white":
                        !msg.isUser,
                    })}
                  >
                    {msg.text}
                  </div>
                  {msg.isUser && (
                    <User className="w-6 h-6 text-gray-500 flex-shrink-0" />
                  )}
                </motion.div>
              ))}
              {isThinking && <ThinkingBubble />}

              {!hasTypedManually && !isThinking && (
                <div className="flex flex-col space-y-2">
                  {faq.map((faq, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="text-left justify-start h-auto whitespace-normal dark:border-gray-600 dark:hover:bg-gray-700"
                      onClick={() => handleFaqClick(faq.question, faq.answer)}
                    >
                      {faq.question}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ketik pertanyaan Anda..."
                  className="flex-1 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  disabled={isThinking}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isThinking}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
