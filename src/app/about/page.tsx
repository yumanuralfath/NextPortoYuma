import { Metadata } from "next";
import Link from "next/link";
import { Code, User, Briefcase, Mail } from "lucide-react";
import CommentForm from "@/components/General/CommentForm";

export const metadata: Metadata = {
  title: "About Me | Yuma Nur Alfath",
  description:
    "Learn more about Yuma Nur Alfath, a passionate full-stack developer with a love for creating elegant and efficient web solutions.",
};

const AboutPage = () => {
  const skills = [
    "TypeScript",
    "JavaScript (ES6+)",
    "React",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "Python",
    "rust",
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono">
      <main className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 py-24">
        <div className="space-y-12">
          <section className="text-center">
            <div className="inline-block p-4 bg-cyan-100 dark:bg-cyan-900/30 rounded-full mb-4">
              <User className="w-12 h-12 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-cyan-400">
              About Me
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-700 dark:text-purple-300 max-w-3xl mx-auto">
              I am a passionate full-stack developer with a love for creating
              elegant, efficient, and user-friendly web solutions.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
              <Code className="w-8 h-8 text-pink-500" />
              My Skills
            </h2>
            <div className="flex flex-wrap justify-center gap-3 text-center">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-md font-semibold text-slate-700 dark:text-slate-300"
                >
                  {skill}
                </div>
              ))}
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Briefcase className="w-8 h-8 text-green-500" />
              My Digital Journal
            </h2>
            <p className="mt-4 text-lg md:text-xl text-gray-700 dark:text-purple-300 max-w-3xl mx-auto">
              I document my journey, thoughts, and projects in my log book. Feel free to take a look.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/log-book"
                className="inline-flex items-center justify-center rounded-xl p-4 px-6 font-bold transition-colors bg-slate-900 text-slate-50 hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                See My Log Book
              </Link>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Mail className="w-8 h-8 text-yellow-500" />
              Leave a Comment
            </h2>
            <p className="mt-4 text-lg md:text-xl text-gray-700 dark:text-purple-300 max-w-3xl mx-auto">
              Have feedback or a random thought? Drop it here. You must be logged in to comment.
            </p>
            <div className="mt-8 max-w-xl mx-auto">
              <CommentForm />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
