"use client";

import { useEffect, useState } from "react";
import { getLogBooks, deleteLogBook } from "@/lib/LogBook";
import { DiaryEntry } from "@/types";
import { Calendar, Trash2, Edit } from "lucide-react";
import AdminNewEntryButton from "../../components/log-book/AdminNewEntryButton";
import Link from "next/link";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/useUserStore";

const LogBookCard = ({
  entry,
  onDelete,
}: {
  entry: DiaryEntry;
  onDelete: (id: string) => void;
}) => {
  const { user } = useUserStore();
  const MAX_LENGTH = 250;

  // Utility to remove HTML tags for a clean summary
  const stripHtml = (html: string) => {
    if (typeof window !== "undefined") {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    }
    return html; // Fallback for server-side rendering
  };

  const plainContent = stripHtml(entry.content);
  const isTruncated = plainContent.length > MAX_LENGTH;
  const summary = isTruncated
    ? plainContent.substring(0, MAX_LENGTH) + "..."
    : plainContent;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-900/50 rounded-2xl shadow-lg shadow-slate-400/10 dark:shadow-cyan-500/10 transition-all duration-300 hover:shadow-slate-400/50 dark:hover:shadow-cyan-500/20 hover:border-slate-300 dark:hover:border-cyan-800/70">
      <div className="p-6">
        <div className="flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-cyan-600 dark:text-cyan-400" />
            <span>
              {new Date(entry.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          {user?.is_admin && (
            <div className="flex items-center gap-2">
              <Link href={`/log-book/${entry.id}/edit`}>
                <button className="text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  <Edit size={16} />
                </button>
              </Link>
              <button
                onClick={() => onDelete(entry.id)}
                className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans text-base">
          {summary}
        </p>
        {isTruncated && (
          <Link
            href={`/log-book/${entry.id}`}
            className="text-cyan-600 dark:text-cyan-400 hover:underline mt-4 inline-block font-semibold"
          >
            Read More &rarr;
          </Link>
        )}
      </div>
    </div>
  );
};

export default function LogBookPage() {
  const { user } = useUserStore();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadEntries = async (reset = false) => {
    setIsLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const response = await getLogBooks(currentPage, 5);

      if (response && response.log_books && response.log_books.length > 0) {
        setEntries((prev) => {
          const newEntries = response.log_books.filter(
            (newEntry: { id: string }) =>
              !(reset ? [] : prev).some(
                (prevEntry) => prevEntry.id === newEntry.id
              )
          );
          return reset ? newEntries : [...prev, ...newEntries];
        });

        if (reset) {
          setPage(2);
        } else {
          setPage((prev) => prev + 1);
        }

        const loadedEntriesCount =
          (reset ? 0 : entries.length) + response.log_books.length;
        if (loadedEntriesCount >= response.pagination.total_items) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        if (reset) setEntries([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load log book entries:", error);
      toast.error("Failed to load data. Please try again later.");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntries(true);
  }, []);

  const handleDelete = async (id: string) => {
    const originalEntries = [...entries];
    setEntries(entries.filter((e) => e.id !== id));

    try {
      await deleteLogBook(id);
      toast.success("Entry deleted successfully!");
    } catch (error) {
      toast.error(`Failed to delete entry: ${error} . Restoring...`);
      setEntries(originalEntries);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900/50 text-slate-800 dark:text-white font-mono p-6 pt-24">
      <main className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-slate-200 dark:border-cyan-900/50 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold dark:text-transparent bg-clip-text dark:bg-gradient-to-r dark:from-cyan-400 dark:to-pink-500 text-center sm:text-left">
            Developer's Log Book
          </h1>
          <div className="flex items-center gap-4">
            {user?.is_admin && <AdminNewEntryButton />}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between mb-8 gap-4"></div>

        <div className="grid gap-8">
          {entries.map((entry) => (
            <LogBookCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>

        {isLoading && (
          <p className="text-center mt-8 text-cyan-600 dark:text-cyan-400">
            Loading entries...
          </p>
        )}

        {!isLoading && hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => loadEntries()}
              disabled={isLoading}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/20 disabled:bg-slate-600 disabled:shadow-none"
            >
              {isLoading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}

        {!hasMore && entries.length > 0 && (
          <p className="text-center mt-8 text-slate-400 dark:text-slate-500">
            You've reached the end.
          </p>
        )}

        {!isLoading && entries.length === 0 && !hasMore && (
          <p className="text-center mt-8 text-slate-500 dark:text-slate-400">
            No entries found. Start by creating one!
          </p>
        )}
      </main>
    </div>
  );
}
