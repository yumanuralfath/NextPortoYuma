"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import NavbarApp from "../App/NavbarApp";
import ThemeToggle from "./ThemeToggle";

const links = [
  { url: "/", title: "Home" },
  { url: "/blog", title: "Blog" },
  { url: "/yuma-app", title: "App" },
];

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

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const topVariants = {
    closed: { rotate: 0 },
    openend: {
      rotate: 45,
      backgroundColor: "rgb(255, 0, 255)",
    },
  };

  const centerVariants = {
    closed: { opacity: 1 },
    openend: { opacity: 0 },
  };

  const bottomVariants = {
    closed: { rotate: 0 },
    openend: {
      rotate: -45,
      backgroundColor: "rgb(255, 0, 255)",
    },
  };

  const listVariants = {
    closed: { x: "100vw" },
    openend: {
      x: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  if (pathname?.startsWith("/app")) {
    return <NavbarApp />;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 text-xl bg-white dark:bg-[#0f0f1a] text-black dark:text-[#00ffe1] shadow-lg font-mono border-b border-gray-200 dark:border-[#00ffe1]">
      {/* LINKS */}
      <div className="hidden md:flex gap-6 w-1/3">
        {links.map((link) => (
          <Link
            href={link.url}
            key={link.title}
            className={`hover:text-pink-500 transition duration-300 ${
              pathname === link.url
                ? "bg-gray-200 dark:bg-[#00ffe1] text-black px-3 py-1 rounded shadow-md dark:shadow-cyan-500"
                : ""
            }`}
          >
            {link.title}
          </Link>
        ))}
      </div>

      {/* LOGO */}
      <div className="md:hidden lg:flex xl:w-1/3 xl:justify-center">
        <Link
          href="/"
          className="text-sm bg-gradient-to-r from-cyan-500 to-purple-400 text-black rounded-md px-3 py-1 font-bold shadow-lg shadow-purple-500/50"
        >
          <span className="mr-1">Yuma</span>
          <span className="bg-white dark:bg-[#0f0f1a] text-black dark:text-[#00ffe1] px-2 py-1 rounded shadow-cyan-500/50 shadow">
            Na
          </span>
        </Link>
      </div>

      {/* SOCIAL */}
      <div className="hidden md:flex gap-4 w-1/3 justify-end">
        <ThemeToggle />
        {socialLinks.map((social) => (
          <Link href={social.url} target="_blank" key={social.alt}>
            <Image src={social.icon} alt={social.alt} width={24} height={24} />
          </Link>
        ))}
      </div>

      {/* RESPONSIVE MENU */}
      <div className="md:hidden">
        <button
          className="w-10 h-8 flex flex-col justify-between z-50 relative"
          onClick={() => setOpen((prev) => !prev)}
        >
          <motion.div
            variants={topVariants}
            animate={open ? "openend" : "closed"}
            className="w-10 h-1 bg-black dark:bg-[#00ffe1] rounded origin-left"
          />
          <motion.div
            variants={centerVariants}
            animate={open ? "openend" : "closed"}
            className="w-10 h-1 bg-black dark:bg-[#00ffe1] rounded"
          />
          <motion.div
            variants={bottomVariants}
            animate={open ? "openend" : "closed"}
            className="w-10 h-1 bg-black dark:bg-[#00ffe1] rounded origin-left"
          />
        </button>

        {/* MENU LIST */}
        {open && (
          <motion.div
            variants={listVariants}
            initial="closed"
            animate="openend"
            className="fixed top-0 left-0 w-screen h-screen bg-white dark:bg-[#0f0f1a] text-black dark:text-[#00ffe1] flex flex-col items-center justify-center gap-8 text-4xl z-40"
          >
            {links.map((link) => (
              <motion.div variants={listVariants} key={link.title}>
                <Link
                  href={link.url}
                  onClick={() => setOpen(false)}
                  className={`${
                    pathname === link.url
                      ? "text-black bg-gray-200 dark:bg-[#00ffe1] px-4 py-2 rounded shadow-lg"
                      : "hover:text-pink-500 transition duration-300"
                  }`}
                >
                  {link.title}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
