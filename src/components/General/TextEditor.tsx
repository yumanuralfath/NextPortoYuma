import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type TextEditorProps = {
  initialText?: string;
  onSave?: (text: string) => void;
  isSaving?: boolean;
};

const TextEditor: React.FC<TextEditorProps> = ({
  initialText = "",
  onSave,
  isSaving = false,
}) => {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setText(initialText);
    if (initialText) {
      setIsEditing(true);
    }
  }, [initialText]);

  const handleSaveClick = () => {
    onSave?.(text);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleCancelClick = () => {
    setText(initialText);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="border border-cyan-500 rounded-xl p-3 md:p-4 bg-[#0f0f1a] shadow-[0_0_10px_#0ff] max-w-full md:max-w-2xl mx-auto w-full"
    >
      {isEditing ? (
        <>
          <motion.textarea
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            className="w-full p-2 text-sm md:p-3 md:text-base bg-[#1a1a2e] text-[#0ff] border border-[#0ff] rounded-lg resize-y shadow-inner focus:outline-none focus:ring-2 focus:ring-[#ff00ff] font-mono"
            placeholder="Teks yang ditranskripsi akan muncul di sini..."
          />
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-3">
            <button
              onClick={handleCancelClick}
              className="w-full sm:w-auto px-3 py-2 text-sm bg-gray-700 text-white hover:bg-gray-600 rounded-lg shadow-md transition disabled:opacity-50"
              disabled={isSaving}
            >
              Batal
            </button>
            <button
              onClick={handleSaveClick}
              disabled={isSaving || !text}
              className="w-full sm:w-auto px-3 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="whitespace-pre-wrap min-h-[120px] text-[#0ff] bg-[#1a1a2e] p-3 rounded-lg font-mono text-sm md:text-base hover:ring-1 ring-[#0ff] cursor-text"
          onClick={() => setIsEditing(true)}
        >
          {text || (
            <span className="text-gray-500 italic">
              Klik untuk mulai menulis...
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TextEditor;
