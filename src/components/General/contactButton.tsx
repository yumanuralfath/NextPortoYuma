"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";
import { MdEmail } from "react-icons/md";

const socialLinks = [
  {
    url: "https://github.com/yumanuralfath",
    icon: "/github.png",
    alt: "Github Icon",
  },
  {
    url: "https://linkedin.com/in/yumana/",
    icon: "/linkedin.png",
    alt: "Linkedin Icon",
  },
  {
    url: "https://www.instagram.com/yumana20",
    icon: "/instagram.png",
    alt: "Instagram Icon",
  },
  {
    url: "https://web.facebook.com/yuma.nuralfath/",
    icon: "/facebook.png",
    alt: "Facebook Icon",
  },
  {
    url: "https://discordapp.com/users/393721612358254592",
    icon: "/discord.png",
    alt: "Discord Icon",
  },
];

export default function ActionButtons() {
  const [showWindow, setShowWindow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center md:items-start gap-4 font-mono text-sm z-10">
      {/* BUTTONS */}
      <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
        <Link href="/project">
          <button className="p-4 px-6 rounded-xl ring-2 ring-cyan-500 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold hover:from-pink-500 hover:to-cyan-500 hover:ring-pink-400 transition-all shadow-lg hover:shadow-pink-500/50 dark:ring-cyan-300 dark:bg-black dark:text-cyan-300 dark:hover:bg-[#1a1a1a] dark:hover:ring-pink-400 dark:shadow-md dark:hover:shadow-pink-500/40">
            View My Projects
          </button>
        </Link>

        <button
          onClick={() => setShowWindow(!showWindow)}
          className="p-4 px-6 rounded-xl ring-2 ring-cyan-300 bg-white text-black font-bold hover:bg-gray-100 hover:ring-pink-400 transition-all shadow-md hover:shadow-lg dark:bg-black dark:text-cyan-300 dark:hover:bg-[#1a1a1a] dark:hover:ring-pink-400 dark:shadow-md dark:hover:shadow-pink-500/40"
        >
          {showWindow ? "Hide Contact" : "Contact Me"}
        </button>
      </div>

      {/* CONTACT WINDOW */}
      {showWindow && (
        <motion.div
          drag={!isMobile}
          dragConstraints={{ top: -200, bottom: 500, left: -300, right: 300 }}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-4 dark:bg-black border-2 dark:border-pink-500 shadow-[0_0_20px_#ff00ff] rounded-xl p-6 w-full max-w-xs sm:max-w-sm md:max-w-md z-20 backdrop-blur-md cursor-default"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-pink-300 text-lg font-bold">Connect with me</h3>
            {/* <button
              onClick={() => setShowWindow(false)}
              className="text-pink-500 hover:text-white transition"
            >
              ✕
            </button> */}
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            {/* WhatsApp Icon */}
            <a
              href="https://wa.me/6282268975635"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform text-green-400"
              title="WhatsApp"
            >
              <FaWhatsapp className="h-6 w-6 sm:h-7 sm:w-7 drop-shadow-[0_0_4px_#00ff00]" />
            </a>

            {/* Email Icon */}
            <a
              href="mailto:yuma@yumana.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              title="Email"
            >
              <MdEmail className="h-6 w-6 sm:h-7 sm:w-7 drop-shadow-[0_0_4px_#00ff00]" />
            </a>

            {/* Other Social Icons */}
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                title={social.alt}
              >
                <Image
                  src={social.icon}
                  alt={social.alt}
                  width={28}
                  height={28}
                  className="h-6 w-6 sm:h-7 sm:w-7 drop-shadow-[0_0_4px_#ff00ff]"
                />
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
