"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const buttonClasses = [
    "relative inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors",
    "border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
    "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
    "focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2",
    "dark:focus:ring-offset-gray-900",
  ].join(" ");

  const sunClasses = `absolute h-6 w-6 transform transition-all duration-500 ease-in-out ${
    isDarkMode
      ? "rotate-90 scale-0 opacity-0"
      : "rotate-0 scale-100 opacity-100"
  }`;

  const moonClasses = `absolute h-6 w-6 transform transition-all duration-500 ease-in-out ${
    isDarkMode
      ? "rotate-0 scale-100 opacity-100"
      : "-rotate-90 scale-0 opacity-0"
  }`;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={buttonClasses}
    >
      <Sun className={sunClasses} />
      <Moon className={moonClasses} />
    </button>
  );
};

export default ThemeToggle;
