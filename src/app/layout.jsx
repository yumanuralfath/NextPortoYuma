import { Inter } from "next/font/google";
import "./globals.css";
import TransitionProvider from "@/components/transitionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Yuma Next Portofolio",
  description: " Yuma Next Portofolio with framer motion",
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
