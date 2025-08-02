"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  LogOut,
  BookUser,
  LayoutDashboard,
  User as UserIcon,
  LogIn,
} from "lucide-react";

import NavbarApp from "../App/NavbarApp";
import ThemeToggle from "@/components/General/ThemeToggle";
import AuthModal from "./AuthModal";

import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";

const links = [
  { url: "/", title: "Home" },
  { url: "/about", title: "About" },
  { url: "/blog", title: "Blog" },
  { url: "/yuma-app", title: "App" },
];

const ProfileDropDown = () => {
  const { user, clearUser } = useUserStore();
  const { clearAccessToken } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    clearAccessToken();
    clearUser();
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-white/10"
      >
        <img
          src={user.profile_picture_url || "/default-avatar.png"}
          alt="User Avatar"
          className="w-8 h-8 rounded-full object-cover border-2 border-cyan-400"
        />
        <span className="font-semibold text-sm hidden sm:inline">
          {user.username}
        </span>
      </button>

      {isOpen && (
        <motion.div
          onMouseLeave={() => setIsOpen(false)}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 mt-2 w-48 bg-slate-800 border border-cyan-900/80 rounded-lg shadow-xl z-50"
        >
          <div className="p-2 text-sm text-slate-300">
            {user.is_admin && (
              <Link
                href="/log-book"
                className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-cyan-500/20 hover:text-cyan-300"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard size={16} />
                Log Book
              </Link>
            )}
            <Link
              href="/app/profile"
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-cyan-500/20 hover:text-cyan-300"
              onClick={() => setIsOpen(false)}
            >
              <BookUser size={16} />
              Profile
            </Link>
            <div className="my-1 border-t border-cyan-900/50" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-pink-400 hover:bg-pink-500/20 hover:text-pink-300"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const AuthButtons = ({ onLoginClick }: { onLoginClick: () => void }) => (
  <button
    onClick={onLoginClick}
    className="px-4 py-2 text-sm font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors"
  >
    Login
  </button>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, clearUser } = useUserStore();
  const { clearAccessToken } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "register">("login");

  const handleSuccessLogin = () => {
    setShowModal(false);
  };

  const handleLogout = () => {
    clearAccessToken();
    clearUser();
    setOpen(false);
  };

  const topVariants = {
    closed: { rotate: 0 },
    openend: { rotate: 45, backgroundColor: "rgb(255, 0, 255)" },
  };
  const centerVariants = { closed: { opacity: 1 }, openend: { opacity: 0 } };
  const bottomVariants = {
    closed: { rotate: 0 },
    openend: { rotate: -45, backgroundColor: "rgb(255, 0, 255)" },
  };
  const listVariants = {
    closed: { x: "100vw" },
    openend: {
      x: 0,
      transition: { when: "beforeChildren", staggerChildren: 0.2 },
    },
  };

  if (pathname?.startsWith("/app")) return <NavbarApp />;

  return (
    <>
      {showModal && (
        <AuthModal
          mode={modalMode}
          onClose={() => setShowModal(false)}
          onSwitchMode={setModalMode}
          onSuccessLogin={handleSuccessLogin}
        />
      )}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 text-xl bg-white dark:bg-[#0f0f1a] text-black dark:text-[#00ffe1] shadow-lg font-mono border-b border-gray-200 dark:border-[#00ffe1]">
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

        <div className="md:hidden lg:flex xl:w-1/3 xl:justify-center">
          <Link
            href="/"
            className="group relative inline-flex gap-1 text-sm font-bold"
          >
            <span className="absolute z-0 h-6 rounded-md transition-transform duration-500 ease-in-out bg-gray-800 dark:bg-white transform dark:translate-x-0 translate-x-[3.5rem] w-[2.5rem] dark:w-[3.2rem]"></span>
            <span className="relative z-10 px-2 py-0.5 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
              Yuma
            </span>
            <span className="relative z-10 px-2 py-0.5 text-white dark:text-black">
              Na
            </span>
          </Link>
        </div>

        <div className="hidden md:flex w-1/3 justify-end items-center gap-4">
          <ThemeToggle />
          {user ? (
            <ProfileDropDown />
          ) : (
            <AuthButtons onLoginClick={() => setShowModal(true)} />
          )}
        </div>

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

          {open && (
            <motion.div
              variants={listVariants}
              initial="closed"
              animate="openend"
              className="fixed top-0 left-0 w-screen h-screen bg-white dark:bg-[#0f0f1a] text-black dark:text-[#00ffe1] flex flex-col items-center justify-center gap-8 text-4xl z-40"
            >
              {links.map((link) => (
                <motion.div variants={listVariants} key={link.title}>
                  <Link href={link.url} onClick={() => setOpen(false)}>
                    {link.title}
                  </Link>
                </motion.div>
              ))}
              <div className="my-4 w-1/2 border-t border-gray-300 dark:border-cyan-800" />
              {user ? (
                <>
                  {user.is_admin && (
                    <Link
                      href="/log-book"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-4 text-3xl"
                    >
                      <LayoutDashboard /> Log Book
                    </Link>
                  )}
                  <Link
                    href="/app/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 text-3xl"
                  >
                    <UserIcon /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 text-3xl text-pink-500"
                  >
                    <LogOut /> Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    setShowModal(true);
                  }}
                  className="flex items-center gap-4 text-3xl"
                >
                  <LogIn /> Login
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
