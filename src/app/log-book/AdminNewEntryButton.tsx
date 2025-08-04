"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";

export default function AdminNewEntryButton() {
  return (
    <Link
      href="/log-book/new"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors"
    >
      <Pencil size={16} />
      New Entry
    </Link>
  );
}
