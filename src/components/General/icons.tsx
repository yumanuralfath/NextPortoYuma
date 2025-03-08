import { FaReact, FaGithub, FaRust } from "react-icons/fa";
import {
  SiVercel,
  SiTailwindcss,
  SiExpress,
  SiTypescript,
  SiJavascript,
  SiSupabase,
} from "react-icons/si";
import { RiNextjsFill } from "react-icons/ri";
import { IoIosRocket } from "react-icons/io";
import { JSX } from "react";

export const techIcons: Record<string, { icon: JSX.Element; link: string }> = {
  "Next.js": {
    icon: <RiNextjsFill size={24} />,
    link: "https://nextjs.org/",
  },
  React: {
    icon: <FaReact size={24} className="text-blue-500" />,
    link: "https://reactjs.org/",
  },
  Tailwind: {
    icon: <SiTailwindcss size={24} className="text-cyan-500" />,
    link: "https://tailwindcss.com/",
  },
  Vercel: {
    icon: <SiVercel size={24} className="text-black" />,
    link: "https://vercel.com/",
  },
  "Rocket.rs": {
    icon: <IoIosRocket size={24} className="text-red-600" />,
    link: "https://rocket.rs/",
  },
  Github: {
    icon: <FaGithub size={24} />,
    link: "https://github.com",
  },
  "Express.js": {
    icon: <SiExpress size={24} />,
    link: "https://expressjs.com/",
  },
  TypeScript: {
    icon: <SiTypescript size={24} className="text-blue-500" />,
    link: "https://www.typescriptlang.org/",
  },
  Rust: {
    icon: <FaRust size={24} />,
    link: "https://www.rust-lang.org/",
  },
  JavaScript: {
    icon: <SiJavascript size={24} className="text-yellow-300" />,
    link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  Supabase: {
    icon: <SiSupabase size={24} className="text-green-500" />,
    link: "https://supabase.com/",
  },
};
