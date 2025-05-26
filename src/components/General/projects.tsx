interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tech: string[];
  github: GithubLinks;
  demo: string;
}

interface GithubLinks {
  main?: string;
  frontend: string;
  backend: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Website Portfolio",
    description: "A modern personal portfolio built with Next.js and Tailwind.",
    image: "/website_porto.png",
    tech: [
      "TypeScript",
      "Rust",
      "Next.js",
      "Tailwind",
      "Vercel",
      "Rocket.rs",
      "Supabase",
    ],
    github: {
      frontend: "https://github.com/yumanuralfath/NextPortoYuma",
      backend: "https://github.com/yumanuralfath/pictoria_api",
    },
    demo: "https://www.yumana.my.id/",
  },
  {
    id: 2,
    title: "Baby and Mom Warehouse",
    description: "A warehouse management system for baby products.",
    image: "/baby_warehouse.png",
    tech: ["JavaScript", "Next.js", "Tailwind", "Vercel", "Express.js"],
    github: {
      main: "https://github.com/BM-Warehouse",
      frontend: "https://github.com/BM-Warehouse/Client",
      backend: "https://github.com/BM-Warehouse/Server",
    },
    demo: "https://bmwarehouse-git-main-bmwarehouses-projects.vercel.app/#Home",
  },
];
