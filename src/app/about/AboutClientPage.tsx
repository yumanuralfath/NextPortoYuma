"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, BookText } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import AuthModal from "@/components/General/AuthModal";

const AboutClientPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const { accessToken } = useAuthStore();
  const router = useRouter();

  const handleLogBookClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!accessToken) {
      setShowAuthModal(true);
    } else {
      router.push("/log-book");
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    router.push("/log-book");
  };

  const handleSwitchAuthMode = (mode: "login" | "register") => {
    setAuthMode(mode);
  };

  return (
    <>
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onSwitchMode={handleSwitchAuthMode}
          onSuccessLogin={handleAuthSuccess}
        />
      )}
      <div className="antialiased text-slate-700 dark:text-slate-300 dark:bg-dark font-mono">
        <main className="container mx-auto px-4 sm:px-6 md:px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-8">
              {/* About Me Section */}
              <section className="w-full">
                <div className="inline-block p-4 bg-cyan-100 dark:bg-cyan-900/30 rounded-full mb-6">
                  <User className="w-12 h-12 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-cyan-400">
                  About Me
                </h1>
                <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-purple-300/90">
                  I’m just a curious person who loves learning about how the world
                  works. My background is in chemistry, but my interests often
                  lead me into exploring science, technology, and any new ideas
                  that spark my curiosity. I don’t see myself as an expert — I
                  just enjoy learning, experimenting, and finding connections
                  between different fields.
                </p>
              </section>

              {/* Digital Journey Log Book Section */}
              <section className="w-full pt-12">
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg p-8 md:p-12 transform transition-transform hover:scale-105">
                  <div className="inline-block p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-5">
                    <BookText className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-green-400 mb-4">
                    Digital Journey Log Book
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-purple-300/90 max-w-2xl mx-auto">
                    I document my journey, thoughts, and the projects I'm
                    tinkering with. Feel free to take a look and see what I've
                    been up to.
                  </p>
                  <div className="mt-8">
                    <Link
                      href="/log-book"
                      onClick={handleLogBookClick}
                      className="inline-flex items-center justify-center rounded-xl px-8 py-4 font-bold text-lg transition-all duration-300 ease-in-out bg-slate-800 text-white hover:bg-slate-700 dark:bg-green-400 dark:text-slate-900 dark:hover:bg-green-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Explore My Log Book
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AboutClientPage;
