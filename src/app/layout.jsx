import { Inter } from "next/font/google";
import "./globals.css";
import TransitionProvider from "@/components/transitionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Yuma Nur Alfath | Portfolio Website",
  description:
    "Yuma Nur Alfath Portfolio Website with Next.js and Rocket Rust Framework",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TransitionProvider> {children} </TransitionProvider>
      </body>
    </html>
  );
}
