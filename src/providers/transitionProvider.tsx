"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Navbar from "../components/General/navbar";
import Chatbot from "../components/General/chatbot";
import { ReactNode } from "react";
import { Footer } from "../components/General/footer";

interface RouteContent {
  [key: string]: string;
}

interface TransitionProviderProps {
  children: ReactNode;
}

const routeContent: RouteContent = {
  "/": "Home",
  "/blog": "Blog",
  "/yuma-app": "Yuma App",
  "/project": "My Project",
};

const TransitionProvider = ({ children }: TransitionProviderProps) => {
  const pathName = usePathname();
  const content = routeContent[pathName];
  const shouldAnimate = Object.keys(routeContent).includes(pathName);

  return (
    <div className="relative w-screen h-screen">
      <Navbar />
      {shouldAnimate ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={pathName}
            initial={{ opacity: 1, height: "100vh" }}
            animate={{ opacity: 0, height: "0vh" }}
            exit={{ opacity: 1, height: "100vh" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 bottom-0 bg-black z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-white text-4xl"
            >
              {content}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      ) : null}
      <div className="relative z-10 w-full h-full overflow-y-auto">
        <Chatbot />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default TransitionProvider;
