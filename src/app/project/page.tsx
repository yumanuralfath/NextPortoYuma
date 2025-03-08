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
    <div className="min-h-screen p-8 pt-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Projects
        </h1>
        <p className="text-gray-600 text-center mb-12 text-lg">
          Some projects that I have worked on
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="relative bg-white rounded-xl shadow-lg overflow-visible hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
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
                <h3 className="text-2xl font-bold mb-3 text-gray-800 hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
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
                          className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                          title={tech}
                        >
                          {techIcons[tech].icon}
                        </span>
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 hover:opacity-100">
                          {tech}
                        </span>
                      </a>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <GithubDropdown
                    frontend={project.github.frontend}
                    backend={project.github.backend}
                  />
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View Live Demo of ${project.title}`}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors text-center font-medium"
                  >
                    Live Demo
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
