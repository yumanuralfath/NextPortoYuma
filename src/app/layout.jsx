import { Inter } from "next/font/google";
import "./globals.css";
import TransitionProvider from "@/components/transitionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "Yuma Nur Alfath | Portfolio Website",
    template: "%s - Yuma Nur Alfath | Portfolio Website",
  },
  description:
    "Yuma Nur Alfath Portfolio Website build with Next.js and Rocket Rust Framework",
  openGraph: {
    title: "Yuma Nur Alfath Website",
    description:
      "Yuma Nur Alfath Portfolio Website build with Next.js and Rocket Rust Framework",
    url: "https://yumana.my.id",
    siteName: "Yuma Nur Alfath Website",
    images: [
      {
        url: "https://www.yumana.my.id/hero.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yuma Nur Alfath Website",
    description:
      "Yuma Nur Alfath Portfolio Website build with Next.js and Rocket Rust Framework",
    images: ["https://www.yumana.my.id/hero.png"],
  },
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
