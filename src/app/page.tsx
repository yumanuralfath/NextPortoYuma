"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Tilt from "react-parallax-tilt";
import ActionButtons from "@/components/General/contactButton";
import { runDecodeEffect } from "@/lib/runDecodeEffect";

const Homepage = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      runDecodeEffect(
        titleRef.current,
        `I'm excited to share my projects and ideas with you. Let's connect and
          collaborate!`,
        50
      );
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 justify-center items-center pt-16 bg-white dark:bg-black text-black dark:text-white font-mono">
      {/* IMAGE CONTAINER */}
      <Tilt>
        <div className="lg:w-1/2 xl:w-2/5 mb-8 lg:mb-0 flex justify-center lg:justify-start">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96">
            <Image
              src="/hero.png"
              alt="Hero Icon"
              className="grayscale rounded-full shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 hover:grayscale-0 dark:grayscale-0"
              fill
              sizes="(max-width: 639px) 14rem, (max-width: 1023px) 16rem, (max-width: 1279px) 20rem, 24rem"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </Tilt>

      {/* TEXT CONTAINER */}
      <div className="h-full lg:w-1/2 flex flex-col gap-8 items-center lg:items-start justify-center text-center lg:text-left">
        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 dark:text-cyan-400 leading-tight">
          Welcome to My Personal Website
        </h1>

        {/* PARAGRAPH */}
        <p
          className="text-lg md:text-xl text-gray-700 dark:text-purple-300 min-h-[4rem]"
          ref={titleRef}
        ></p>

        {/* BUTTON */}
        {/* <div className="w-full flex flex-col lg:flex-row gap-4 justify-center lg:justify-start">
          <button className="p-4 px-6 rounded-lg ring-1 ring-cyan-500 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold hover:from-pink-500 hover:to-cyan-500 hover:ring-pink-400 transition-all shadow-md hover:shadow-lg">
            <Link href="/project">View My Projects</Link>
          </button>
          <button className="p-4 px-6 rounded-lg ring-1 ring-cyan-300 bg-white text-black font-semibold hover:bg-gray-100 hover:ring-pink-400 transition-all shadow-md hover:shadow-lg">
            <Link href="https://wa.me/6282268975635">Contact Me</Link>
          </button>
        </div> */}
        <ActionButtons />
      </div>
    </div>
  );
};

export default Homepage;
