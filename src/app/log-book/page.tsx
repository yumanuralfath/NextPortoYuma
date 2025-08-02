import { mockDiaryEntries } from "@/content/diary";
import { DiaryEntry } from "@/types";
import { Calendar } from "lucide-react";
import AdminNewEntryButton from "./AdminNewEntryButton";

const getLogBookEntries = async (): Promise<DiaryEntry[]> => {
  // In the future, this will fetch from a real API
  // For now, we sort the mock data by date
  return [...mockDiaryEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

const LogBookCard = ({ entry }: { entry: DiaryEntry }) => (
  <div className="bg-slate-900 border border-cyan-900/50 rounded-2xl shadow-lg shadow-cyan-500/10 transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-800/70">
    <div className="p-6">
      <div className="flex items-center gap-3 text-sm text-slate-400 mb-4 pb-4 border-b border-slate-800">
        <Calendar size={16} className="text-cyan-400" />
        <span>
          {new Date(entry.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
      <div className="text-slate-300 whitespace-pre-wrap font-sans text-base">
        {entry.content}
      </div>
    </div>
  </div>
);

export default async function LogBookPage() {
  const entries = await getLogBookEntries();

  return (
    <div className="min-h-screen bg-slate-900/50 text-white font-mono p-6 pt-24">
      <main className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-cyan-900/50">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            Developer's Log Book
          </h1>
          <AdminNewEntryButton />
        </div>

        <div className="grid gap-8">
          {entries.map((entry) => (
            <LogBookCard key={entry.id} entry={entry} />
          ))}
        </div>
      </main>
    </div>
  );
}
