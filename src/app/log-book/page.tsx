"use client";

import { useEffect, useState, useCallback } from "react";
import { getLogBooks, deleteLogBook } from "@/lib/LogBook";
import { DiaryEntry } from "@/types";
import {
  Calendar,
  Trash2,
  Edit,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
} from "lucide-react";
import AdminNewEntryButton from "../../components/log-book/AdminNewEntryButton";
import Link from "next/link";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/useUserStore";

const LOGS_PER_PAGE = 5;

const LogBookCard = ({
  entry,
  onDelete,
}: {
  entry: DiaryEntry;
  onDelete: (id: string) => void;
}) => {
  const { user } = useUserStore();

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

        <div className="relative max-h-40 overflow-hidden">
          <div
            className="prose dark:prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none"></div>
        </div>

        <Link
          href={`/log-book/${entry.id}`}
          className="text-cyan-600 dark:text-cyan-400 hover:underline mt-4 inline-block font-semibold"
        >
          Read More &rarr;
        </Link>
      </div>
    </div>
  );
};

export default function LogBookPage() {
  const { user } = useUserStore();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [sortOrder, setSortOrder] = useState<"oldest" | "newest">("oldest");
  const [nextPageToFetch, setNextPageToFetch] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const initialize = useCallback(async () => {
    setIsInitializing(true);
    setEntries([]);
    setHasMore(true);
    setIsLoading(false);

    try {
      const initialResponse = await getLogBooks(1, LOGS_PER_PAGE);
      if (
        !initialResponse ||
        !initialResponse.pagination ||
        initialResponse.pagination.total_items === 0
      ) {
        setHasMore(false);
        setEntries([]);
        return;
      }

      const { total_items } = initialResponse.pagination;
      const totalPages = Math.ceil(total_items / LOGS_PER_PAGE);

      if (sortOrder === "oldest") {
        const lastPageResponse = await getLogBooks(totalPages, LOGS_PER_PAGE);
        if (lastPageResponse && lastPageResponse.log_books) {
          setEntries(lastPageResponse.log_books.reverse());
          const newNextPage = totalPages - 1;
          setNextPageToFetch(newNextPage > 0 ? newNextPage : null);
          setHasMore(newNextPage > 0);
        }
      } else {
        // sortOrder === 'newest'
        setEntries(initialResponse.log_books);
        const newNextPage = 2;
        setNextPageToFetch(totalPages > 1 ? newNextPage : null);
        setHasMore(totalPages > 1);
      }
    } catch (error) {
      console.error("Failed to initialize log book:", error);
      toast.error("Failed to load data. Please refresh the page.");
      setHasMore(false);
    } finally {
      setIsInitializing(false);
    }
  }, [sortOrder]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const loadMoreEntries = useCallback(async () => {
    if (nextPageToFetch === null || isLoading) return;

    setIsLoading(true);
    try {
      const response = await getLogBooks(nextPageToFetch, LOGS_PER_PAGE);
      if (response && response.log_books && response.log_books.length > 0) {
        const newEntries =
          sortOrder === "oldest"
            ? response.log_books.reverse()
            : response.log_books;
        setEntries((prev) => [...prev, ...newEntries]);

        const newNextPage =
          sortOrder === "oldest" ? nextPageToFetch - 1 : nextPageToFetch + 1;
        const totalPages = Math.ceil(
          response.pagination.total_items / LOGS_PER_PAGE
        );

        if (sortOrder === "oldest" && newNextPage > 0) {
          setNextPageToFetch(newNextPage);
        } else if (sortOrder === "newest" && newNextPage <= totalPages) {
          setNextPageToFetch(newNextPage);
        } else {
          setNextPageToFetch(null);
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more entries:", error);
      toast.error("Failed to load more data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [nextPageToFetch, isLoading, sortOrder]);

  const handleDelete = async (id: string) => {
    const originalEntries = [...entries];
    setEntries(entries.filter((e) => e.id !== id));
    try {
      await deleteLogBook(id);
      toast.success("Entry deleted successfully!");
    } catch (error) {
      toast.error(`Failed to delete entry: ${error}. Restoring...`);
      setEntries(originalEntries);
    }
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "oldest" ? "newest" : "oldest"));
  };

  const handleNewEntry = () => {
    setSortOrder("oldest");
    initialize();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900/50 text-slate-800 dark:text-white font-mono p-6 pt-24">
      <main className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-slate-200 dark:border-cyan-900/50 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold dark:text-transparent bg-clip-text dark:bg-gradient-to-r dark:from-cyan-400 dark:to-pink-500 text-center sm:text-left">
            Developer's Log Book
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSortToggle}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors"
              title={`Sort by ${sortOrder === "oldest" ? "Newest" : "Oldest"}`}
            >
              {sortOrder === "oldest" ? (
                <ArrowUpNarrowWide size={16} />
              ) : (
                <ArrowDownWideNarrow size={16} />
              )}
              <span>{sortOrder === "oldest" ? "Oldest" : "Newest"}</span>
            </button>
            {user?.is_admin && (
              <AdminNewEntryButton onNewEntry={handleNewEntry} />
            )}
          </div>
        </div>

        {isInitializing ? (
          <p className="text-center mt-8 text-cyan-600 dark:text-cyan-400">
            Initializing Log Book...
          </p>
        ) : (
          <>
            <div className="grid gap-8">
              {entries.map((entry) => (
                <LogBookCard
                  key={entry.id}
                  entry={entry}
                  onDelete={handleDelete}
                />
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
                  onClick={loadMoreEntries}
                  disabled={isLoading}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/20 disabled:bg-slate-600 disabled:shadow-none"
                >
                  {isLoading
                    ? "Loading..."
                    : sortOrder === "oldest"
                    ? "Load Older Entries"
                    : "Load More Entries"}
                </button>
              </div>
            )}

            {!hasMore && entries.length > 0 && (
              <p className="text-center mt-8 text-slate-400 dark:text-slate-500">
                {sortOrder === "oldest"
                  ? "You've reached the end. "
                  : "You've reached the beginning."}
              </p>
            )}

            {!isInitializing && !isLoading && entries.length === 0 && (
              <p className="text-center mt-8 text-slate-500 dark:text-slate-400">
                No entries found. Start by creating one!
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
