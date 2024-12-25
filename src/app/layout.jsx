import { Inter } from "next/font/google";
import "./globals.css";
import TransitionProvider from "@/components/transitionProvider";
import Particle from "@/components/particle";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Yuma Nur Alfath | Portfolio Website",
  description: "Yuma Nur Alfath Portfolio Website with Next.js and Rocker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Particle />
        <TransitionProvider> {children} </TransitionProvider>
      </body>
    </html>
  );
}
