"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProviderWrapper({ children }: ThemeProviderProps) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
