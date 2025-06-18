const JournalViewer = ({
  loading,
  audioUrl,
  journalText,
}: {
  loading: boolean;
  audioUrl: string | null;
  journalText: string | null;
}) => {
  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4">
      <h3 className="text-2xl font-bold text-pink-400 mb-4">
        🎙️ Journal Entry
      </h3>
      {loading ? (
        <p className="text-cyan-400 animate-pulse">Loading...</p>
      ) : journalText || audioUrl ? (
        <div className="space-y-4">
          {audioUrl && (
            <audio
              controls
              src={audioUrl}
              className="w-full rounded-xl shadow-md"
            />
          )}
          {journalText && (
            <div className="p-4 bg-[#1a001a] border border-pink-600 rounded-xl shadow-[0_0_10px_#ff00ff]">
              <h4 className="font-bold mb-2 text-cyan-400">📝 Journal:</h4>
              <p className="whitespace-pre-wrap text-pink-100 font-mono">
                {journalText}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-400 italic">No journal entry for this day.</p>
      )}
    </div>
  );
};

export default JournalViewer;
