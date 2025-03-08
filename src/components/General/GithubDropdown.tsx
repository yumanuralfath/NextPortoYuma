"use client";

import { useState, useRef, useEffect } from "react";
import { FaGithub } from "react-icons/fa";

const GithubDropdown = ({
  frontend,
  backend,
}: {
  frontend?: string;
  backend?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 w-full"
      >
        <FaGithub />
        Repositories
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 left-auto mt-2 bg-gray-800 rounded-md p-2 z-50 min-w-[180px] shadow-xl"
        >
          {frontend && (
            <a
              href={frontend}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 p-2 block"
            >
              Frontend Repo
            </a>
          )}
          {backend && (
            <a
              href={backend}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 p-2 block"
            >
              Backend Repo
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default GithubDropdown;
