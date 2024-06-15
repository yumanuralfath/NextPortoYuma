/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";
import { ReactTyped } from "react-typed";
import Tilt from "react-parallax-tilt";


const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 justify-center items-center pt-16">
      {" "}
      
      {/* IMAGE CONTAINER */}
      <Tilt>
        <div className="lg:w-1/3 xl:w-1/4 mb-8 lg:mb-0 flex justify-center lg:justify-start">
          <div className="relative w-48 h-48 lg:w-64 lg:h-64 xl:w-72 xl:h-72">
            <Image
              src="/hero.png"
              alt="Hero Icon"
              className="grayscale rounded-full shadow-none transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-black hover:grayscale-0"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </Tilt>
      {/* TEXT CONTAINER */}
      <div className="h-full lg:w-2/3 flex flex-col gap-8 items-center lg:items-start justify-center text-center lg:text-left">
        {/* TITLE */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
          Hello, I'm <br />
          Yuma Nur Alfath
        </h1>
        {/* SUBTITLE */}
        <ReactTyped
          strings={[
            "Junior Frontend Developer",
            "Junior Backend Developer",
            "Junior FullStack Developer",
          ]}
          typeSpeed={40}
          backSpeed={30}
          loop
          className="md:text-xl"
        />
        {/* BUTTON */}
        <div className="w-full flex flex-col lg:flex-row gap-4 justify-center lg:justify-start">
          <button className="p-4 rounded-lg ring-1 ring-black bg-black text-white hover:bg-white hover:text-black transition-colors">
            View My Project
          </button>
          <button className="p-4 rounded-lg ring-1 ring-black hover:bg-black hover:text-white transition-colors">
            Contact Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
