import { removeAccessToken } from "@/lib/fetchLib";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface User {
  username: string;
  email: string;
  profile_picture_url: string;
}

const NavbarApp = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/yuma-app");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    removeAccessToken();
    router.push("/yuma-app");
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <a
          href="/app"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src="/navbar.png" className="h-8" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Portfolio App
          </span>
        </a>

        {/* Profile Dropdown */}
        <div
          className="relative flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
          ref={dropdownRef}
        >
          <button
            type="button"
            className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            id="user-menu-button"
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
              className="z-50 absolute top-12 right-4 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
              id="user-dropdown"
            >
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  {user.username}
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  {user.email}
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <a
                    href="/app/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarApp;
