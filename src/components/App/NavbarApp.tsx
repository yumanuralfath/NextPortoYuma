import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { removeUser } from "@/lib/removeUserAfterLogout";
import { useUserStore } from "@/store/useUserStore";
import ThemeToggle from "../General/ThemeToggle";

const NavbarApp = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isDropdownOpen) {
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
  }, [isDropdownOpen, handleClickOutside, handleKeyDown]);

  const handleLogout = () => {
    removeUser();
    router.replace("/yuma-app");
  };

  if (!user) return null;

  return (
    <nav className="bg-white dark:bg-[#0f0f1b] border-b border-gray-200 dark:border-purple-500 shadow-md dark:shadow-[0_4px_10px_rgba(255,0,255,0.3)] font-mono">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <a
          href="/app"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src="/navbar.png" className="h-14" alt="Logo" />
          <span className="self-center text-2xl font-bold text-gray-800 dark:text-cyan-400 dark:drop-shadow-[0_0_6px_#00ffff]">
            Portfolio App
          </span>
        </a>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* Profile Dropdown */}
          <div
            className="relative flex items-center md:order-2"
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
                className="z-50 absolute top-12 right-0 mt-2 w-48 text-base list-none bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-cyan-500 rounded-lg shadow-lg"
                id="user-dropdown"
              >
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-cyan-300">
                    {user.username}
                  </span>
                  <span className="block text-sm text-gray-500 dark:text-purple-300 truncate">
                    {user.email}
                  </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <a
                      href="/app/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-cyan-200 hover:bg-gray-100 dark:hover:bg-cyan-700/20 hover:text-gray-900 dark:hover:text-white"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-red-600 dark:text-pink-300 hover:bg-gray-100 dark:hover:bg-pink-700/20 hover:text-red-800 dark:hover:text-white w-full text-left"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarApp;
