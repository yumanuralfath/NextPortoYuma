import Image from "next/image";
import { Metadata } from "next";
import { techIcons } from "@/components/General/icons";
import { projects } from "@/components/General/projects";
import GithubDropdown from "@/components/General/GithubDropdown";

export const metadata: Metadata = {
  title: "Project",
  description: "Project Portfolio Yuma Nur Alfath",
  openGraph: {
    title: "Project Portfolio",
    description: "Project Portfolio",
    url: "https://yumana.my.id/project",
    siteName: "Yuma Nur Alfath Portfolio Website",
    images: [
      {
        url: "https://yumana.my.id/hero_metadata.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    alternateLocale: ["id_ID"],
    type: "website",
  },
};

const ProjectPage: React.FC = () => {
  return (
    <div className="min-h-screen dark:bg-gradient-to-br from-black via-[#0f0c29] to-[#302b63] px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 pt-20 text-white font-mono">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r dark:from-pink-500 dark:via-purple-500 dark:to-blue-500 bg-clip-text text-transparent drop-shadow-neon">
          MY PROJECTS
        </h1>
        <p className="dark:text-gray-300 text-black text-center mb-12 text-lg tracking-wide">
          Some projects that I have worked on
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="relative dark:bg-[#1a1a2e] border border-[#3a0ca3] rounded-xl shadow-[0_0_15px_rgba(173,0,255,0.4)] hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                <Image
                  src={project.image}
                  alt={`Preview of ${project.title}`}
                  width={400}
                  height={200}
                  loading="lazy"
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-cyan-300 hover:text-pink-500 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <div
                      key={tech}
                      className="relative inline-flex items-center"
                    >
                      <a
                        href={techIcons[tech].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative"
                      >
                        <span
                          className="text-purple-400 hover:text-pink-400 transition-colors cursor-pointer"
                          title={tech}
                        >
                          {techIcons[tech].icon}
                        </span>
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs text-white bg-black/80 border border-cyan-400 rounded-md opacity-0 hover:opacity-100 z-20">
                          {tech}
                        </span>
                      </a>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <GithubDropdown
                    main={project.github.main}
                    frontend={project.github.frontend}
                    backend={project.github.backend}
                  />
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View Live Demo of ${project.title}`}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-lg shadow-lg hover:from-pink-600 hover:to-cyan-600 transition-all text-center font-semibold"
                  >
                    🚀 Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
