"use client";

import Image from "next/image";
import Tilt from "react-parallax-tilt";
import Link from "next/link";

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 justify-center items-center pt-16 bg-gray-50">
      {/* IMAGE CONTAINER */}
      <Tilt>
        <div className="lg:w-1/2 xl:w-2/5 mb-8 lg:mb-0 flex justify-center lg:justify-start">
          <div className="relative w-64 h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96">
            <Image
              src="/hero.png"
              alt="Hero Icon"
              className="grayscale rounded-full shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 hover:grayscale-0"
              fill
              sizes="(max-width: 1024px) 20rem, (max-width: 1280px) 25rem, 30rem"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </Tilt>
      {/* TEXT CONTAINER */}
      <div className="h-full lg:w-1/2 flex flex-col gap-8 items-center lg:items-start justify-center text-center lg:text-left">
        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 leading-tight">
          Welcome to My{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            Personal Website
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Hi there! I'm excited to share my projects and ideas with you. Let's
          connect and collaborate!
        </p>
        {/* BUTTON */}
        <div className="w-full flex flex-col lg:flex-row gap-4 justify-center lg:justify-start">
          <button className="p-4 px-6 rounded-lg ring-1 ring-gray-300 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-purple-500 hover:to-blue-500 hover:ring-gray-400 transition-all shadow-md hover:shadow-lg">
            <Link href="/project">View My Projects</Link>
          </button>
          <button className="p-4 px-6 rounded-lg ring-1 ring-gray-300 bg-white text-gray-800 font-semibold hover:bg-gray-100 hover:ring-gray-400 transition-all shadow-md hover:shadow-lg">
            <Link href="https://wa.me/6282268975635">Contact Me</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
