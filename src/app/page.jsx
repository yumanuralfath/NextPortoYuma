import Image from "next/image";

const Homepage = () => {
  return (
    <div className="h-full flex flex-col lg:flex-row px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 justify-center items-center">
      {/* IMAGE CONTAINER */}
      <div className="lg:w-1/3 xl:w-1/4 mb-8 lg:mb-0 flex justify-center lg:justify-start">
        <div className="relative w-48 h-48 lg:w-64 lg:h-64 xl:w-72 xl:h-72">
          <Image
            src="/hero.png"
            alt="Hero Icon"
            className="grayscale hover:grayscale-0 rounded-full border-double border-8 border-orange-100"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
      {/* TEXT CONTAINER */}
      <div className="h-full lg:w-1/2 flex flex-col gap-8 items-center lg:items-start justify-center text-center lg:text-left">
        {/* TITLE */}
        <h1 className="text-4xl md:text-6xl font-bold">
          Full Stack Web Developer
        </h1>
        {/* DESC */}
        <p className="md:text-xl">
          I&apos;m a junior full-stack developer with a primary focus on web
          development. However, I&apos;m also deeply intrigued by mobile app
          development and artificial intelligence. I thrive on learning new
          skills and am constantly seeking out fresh opportunities to grow and
          contribute.
        </p>
        {/* BUTTON */}
        <div className="w-full flex flex-col lg:flex-row gap-4 justify-center lg:justify-start">
          <button className="p-4 rounded-lg ring-1 ring-black bg-black text-white">
            View My Project
          </button>
          <button className="p-4 rounded-lg ring-1 ring-black">
            Contact Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
