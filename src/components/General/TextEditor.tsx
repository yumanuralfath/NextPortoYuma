import { useState, useEffect } from "react";

type TextEditorProps = {
  initialText?: string;
  onSave?: (text: string) => void;
};

const TextEditor: React.FC<TextEditorProps> = ({
  initialText = "",
  onSave,
}) => {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleSave = () => {
    onSave?.(text);
    setIsEditing(false);
  };

  return (
    <div className="border border-cyan-500 rounded-xl p-4 bg-[#0f0f1a] shadow-[0_0_10px_#0ff] max-w-2xl mx-auto w-full">
      {isEditing ? (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            className="w-full p-3 text-sm md:text-base bg-[#1a1a2e] text-[#0ff] border border-[#0ff] rounded-lg resize-y shadow-inner focus:outline-none focus:ring-2 focus:ring-[#ff00ff] font-mono"
          />
          <div className="flex justify-end gap-3 mt-3 flex-wrap">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm md:text-base bg-gray-700 text-white hover:bg-gray-600 rounded-lg shadow-md transition"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm md:text-base bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg shadow-lg transition"
            >
              Simpan
            </button>
          </div>
        </>
      ) : (
        <div
          className="whitespace-pre-wrap min-h-[120px] text-[#0ff] bg-[#1a1a2e] p-3 rounded-lg font-mono text-sm md:text-base hover:ring-1 ring-[#0ff] cursor-text"
          onClick={() => setIsEditing(true)}
        >
          {text || (
            <span className="text-gray-500 italic">
              Klik untuk mulai menulis...
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TextEditor;
