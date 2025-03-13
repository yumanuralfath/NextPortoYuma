"use client";

import { useState, useRef, useEffect } from "react";
import { FaGithub } from "react-icons/fa";

const GithubDropdown = ({
  main,
  frontend,
  backend,
}: {
  main?: string;
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
          className="absolute top-full left-0 right-auto mt-2 bg-gray-800
          rounded-2xl p-1 z-50 min-w-[90px] shadow-2xl"
        >
          {main && (
            <a
              href={main}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 p-2 block"
            >
              Main
            </a>
          )}
          {frontend && (
            <a
              href={frontend}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 p-2 block"
            >
              Frontend
            </a>
          )}
          {backend && (
            <a
              href={backend}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 p-2 block"
            >
              Backend
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default GithubDropdown;
