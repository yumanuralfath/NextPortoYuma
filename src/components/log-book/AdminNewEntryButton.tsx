"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";

interface AdminNewEntryButtonProps {
  onNewEntry?: () => void;
}

export default function AdminNewEntryButton({ onNewEntry }: AdminNewEntryButtonProps) {
  // The onNewEntry callback can be used in the future if the creation form
  // becomes a modal, for example. For now, the page will re-initialize
  // on navigation. The prop is passed from the parent for completeness.
  return (
    <Link
      href="/log-book/new"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors"
      onClick={() => {
        if (onNewEntry) {
          // This might be useful if the navigation is client-side without a full reload
          // and we want to trigger a re-fetch in the parent component.
        }
      }}
    >
      <Pencil size={16} />
      New Entry
    </Link>
  );
}
