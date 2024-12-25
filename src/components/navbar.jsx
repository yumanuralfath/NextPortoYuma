"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import NavLink from "./NavLink";
import { motion } from "framer-motion";

const links = [
  { url: "/", title: "Home" },
  { url: "/blog", title: "Blog" },
  { url: "/pictoria", title: "Pictoria" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const topVariants = {
    closed: {
      rotate: 0,
    },
    openend: {
      rotate: 45,
      backgroundColor: "rgb(255,255,255)",
    },
  };

  const centerVariants = {
    closed: {
      opacity: 1,
    },
    openend: {
      opacity: 0,
    },
  };

  const bottomVariants = {
    closed: {
      rotate: 0,
    },
    openend: {
      rotate: -45,
      backgroundColor: "rgb(255,255,255)",
    },
  };

  const listVariants = {
    closed: {
      x: "100vw",
    },
    openend: {
      x: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 text-xl bg-transparent shadow">
      {/* LINKS */}
      <div className="hidden md:flex gap-4 w-1/3">
        {links.map((link) => (
          <NavLink link={link} key={link.title} />
        ))}
      </div>
      {/* Logo */}
      <div className="md:hidden lg:flex xl:w-1/3 xl:justify-center">
        <Link
          href="/"
          className="text-sm bg-black rounded-md p-1 font-semibold flex items-center justify-center"
        >
          <span className="text-white mr-1">Yuma</span>
          <span className="w-12 h-8 rounded bg-white text-black flex items-center justify-center">
            Na
          </span>
        </Link>
      </div>
      <div className="hidden md:flex gap-4 w-1/3 justify-end">
        <Link href="https://github.com/yumanuralfath" target="_blank">
          <Image src="/github.png" alt="Github Icon" width={24} height={24} />
        </Link>
        <Link href="https://linkedin.com/in/yumana/" target="_blank">
          <Image
            src="/linkedin.png"
            alt="Linkedin Icon"
            width={24}
            height={24}
          />
        </Link>
        <Link href="https://www.instagram.com/yumana20" target="_blank">
          <Image
            src="/instagram.png"
            alt="Instagram Icon"
            width={24}
            height={24}
          />
        </Link>
        <Link href="https://web.facebook.com/yuma.nuralfath/" target="_blank">
          <Image
            src="/facebook.png"
            alt="Facebook Icon"
            width={24}
            height={24}
          />
        </Link>
      </div>
      {/* Responsive Menu */}
      <div className="md:hidden">
        {/* Menu Button */}
        <button
          className="w-10 h-8 flex flex-col justify-between z-50 relative"
          onClick={() => setOpen((prev) => !prev)}
        >
          <motion.div
            variants={topVariants}
            animate={open ? "openend" : "closed"}
            className="w-10 h-1 bg-black rounded origin-left"
          ></motion.div>
          <motion.div
            variants={centerVariants}
            animate={open ? "openend" : "closed"}
            className="w-10 h-1 bg-black rounded"
          ></motion.div>
          <motion.div
            variants={bottomVariants}
            animate={open ? "openend" : "closed"}
            className="w-10 h-1 bg-black rounded origin-left"
          ></motion.div>
        </button>
        {/* MENU LIST */}
        {open && (
          <motion.div
            variants={listVariants}
            initial="closed"
            animate="openend"
            className="fixed top-0 left-0 w-screen h-screen bg-black text-white flex flex-col items-center justify-center gap-8 text-4xl z-40"
          >
            {links.map((link) => (
              <motion.div variants={listVariants} key={link.title}>
                <Link href={link.url} onClick={() => setOpen(false)}>
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
