import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@/types";
import { removeUser } from "@/lib/removeUserAfterLogout";
import { useUserStore } from "@/store/useUserStore";
import ThemeToggle from "../General/ThemeToggle";
import { Menu, X, Home, Settings, LogOut } from "lucide-react";

const NavbarApp = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const userData = useUserStore.getState().user;
      if (!userData) {
        router.replace("/yuma-app");
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.replace("/yuma-app");
    }
  }, [router]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    },
    [dropdownRef, menuRef]
  );

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsDropdownOpen(false);
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isDropdownOpen || isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen, isMenuOpen, handleClickOutside, handleKeyDown]);

  const handleLogout = () => {
    removeUser();
    router.replace("/yuma-app");
  };

  if (!user) return null;

  return (
    <nav
      ref={menuRef}
      className="bg-white dark:bg-[#0f0f1b] border-b border-gray-200 dark:border-purple-500 shadow-md dark:shadow-[0_4px_10px_rgba(255,0,255,0.3)] font-mono"
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link
          href="/app"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src="/navbar.png" className="h-12 md:h-14" alt="Logo" />
          <span className="self-center text-xl md:text-2xl font-bold text-gray-800 dark:text-cyan-400 dark:drop-shadow-[0_0_6px_#00ffff]">
            Portfolio App
          </span>
        </Link>

        {/* Hamburger Menu Button */}
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Menu for Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {/* Profile Dropdown */}
          <div
            className="relative flex items-center"
            ref={dropdownRef}
          >
            <button
              type="button"
              className="flex text-sm bg-gray-100 dark:bg-black border border-gray-300 dark:border-cyan-500 rounded-full p-1 hover:shadow-lg dark:hover:shadow-cyan-500/30"
              id="user-menu-button"
              aria-controls="user-dropdown"
              aria-expanded={isDropdownOpen}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <img
                src={user.profile_picture_url}
                className="w-8 h-8 rounded-full"
                alt="User photo"
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="z-50 absolute top-12 right-0 mt-2 w-56 text-base list-none bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-cyan-500 rounded-lg shadow-lg"
                id="user-dropdown"
              >
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-cyan-300 font-semibold">
                    {user.username}
                  </span>
                  <span className="block text-sm text-gray-500 dark:text-purple-300 truncate">
                    {user.email}
                  </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <Link
                      href="/"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-cyan-200 hover:bg-gray-100 dark:hover:bg-cyan-700/20 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Home className="w-4 h-4" />
                      <span>Back to Main</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/app/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-cyan-200 hover:bg-gray-100 dark:hover:bg-cyan-700/20 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-pink-300 hover:bg-gray-100 dark:hover:bg-pink-700/20 hover:text-red-800 dark:hover:text-white w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Collapsible Menu for Mobile */}
        {isMenuOpen && (
          <div className="w-full md:hidden" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <li className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <img
                    src={user.profile_picture_url}
                    className="w-10 h-10 rounded-full"
                    alt="User photo"
                  />
                  <div>
                    <span className="block text-base text-gray-900 dark:text-cyan-300 font-semibold">
                      {user.username}
                    </span>
                    <span className="block text-sm text-gray-500 dark:text-purple-300 truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 text-gray-900 dark:text-cyan-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span>Back to Main</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/app/profile"
                  className="flex items-center gap-3 px-4 py-3 text-gray-900 dark:text-cyan-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-pink-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign out</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarApp;
