/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getLogBookById } from "@/lib/LogBook";
import { DiaryEntry } from "@/types";
import { Calendar, Edit } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";

export default function LogBookDetailPage() {
  const { id } = useParams();
  const { user } = useUserStore();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchEntry = async () => {
        try {
          const data = await getLogBookById(id as string);
          if (data && data.content) {
            setEntry(data);
          } else {
            setError("Entry not found.");
          }
        } catch (err: any) {
          console.error("Fetch error:", err);
          setError(err.message || "Failed to load the entry.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchEntry();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-cyan-400 font-mono">
        Loading entry...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-500 font-mono">
        <p>{error}</p>
        <Link href="/log-book" className="mt-4 text-cyan-400 hover:underline">
          &larr; Back to Log Book
        </Link>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen font-mono">
        <p className="text-slate-400">Entry not found.</p>
        <Link href="/log-book" className="mt-4 text-cyan-400 hover:underline">
          &larr; Back to Log Book
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white font-mono p-6 pt-24">
      <main className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/log-book"
            className="inline-flex items-center text-cyan-500 dark:text-cyan-400 hover:underline transition-colors"
          >
            &larr; Back to Log Book
          </Link>
        </div>
        <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-900/50 rounded-2xl shadow-lg p-6 md:p-8">
          <header className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <Calendar
                  size={16}
                  className="text-cyan-600 dark:text-cyan-400"
                />
                <span>
                  {new Date(entry.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {user?.is_admin && entry && (
                <Link href={`/log-book/${entry.id}/edit`}>
                  <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                </Link>
              )}
            </div>
          </header>
          <div
            className="prose prose-slate dark:prose-invert max-w-none font-sans text-base text-slate-700 dark:text-slate-300 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        </article>
      </main>
    </div>
  );
}
