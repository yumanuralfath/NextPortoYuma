import { Inter } from "next/font/google";
import "./globals.css";
import TransitionProvider from "../components/transitionProvider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "Yuma Nur Alfath | Portfolio Website",
    template: "%s - Yuma Nur Alfath",
  },
  description:
    "Yuma Nur Alfath Portfolio Website build with Next.js and Rocket Rust Framework",
  openGraph: {
    title: "Yuma Nur Alfath | Portfolio Website",
    description:
      "Yuma Nur Alfath Portfolio Website build with Next.js and Rocket Rust Framework",
    url: "https://yumana.my.id",
    siteName: "Yuma Nur Alfath Website",
    images: [
      {
        url: "https://yumana.my.id/hero_metadata.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yuma Nur Alfath | Portfolio Website",
    description:
      "Yuma Nur Alfath Portfolio Website build with Next.js and Rocket Rust Framework",
    images: ["https://yumana.my.id/hero_metadata.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta name="p:domain_verify" content="c801e44222b4e6bc238e8714a4e171de" />
      <body className={inter.className}>
        <TransitionProvider> {children} </TransitionProvider>
        <Analytics />
      </body>
    </html>
  );
}
