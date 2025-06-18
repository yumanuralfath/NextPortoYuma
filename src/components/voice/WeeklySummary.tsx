import { humanReadableDate } from "@/lib/Time";

export const WeeklySummary = ({
  journal,
  createdAt,
}: {
  journal: string;
  createdAt: string;
}) => (
  <div className="bg-purple-950 text-pink-100 border border-pink-400 rounded-xl p-6 shadow-lg space-y-4 max-w-3xl mx-auto animate-fade-in">
    <h2 className="text-2xl font-bold text-center text-pink-300 drop-shadow-glow">
      🗓️ Kilas Balik Mingguan
    </h2>
    <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base font-mono text-cyan-200">
      {journal}
      <div className="mt-4 text-right text-xs text-cyan-400 italic">
        Dibuat: {humanReadableDate(createdAt)}
      </div>
    </div>
  </div>
);
