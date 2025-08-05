import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiMaximize, FiMinimize } from "react-icons/fi";

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
  const [fullscreen, setFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleFocus = () => {
    setTimeout(() => {
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 150);
  };

  const toggleFullscreen = () => {
    setFullscreen((prev) => !prev);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 300);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`w-full px-3 sm:px-0 mx-auto ${
        fullscreen
          ? "fixed top-0 left-0 w-full h-full z-50 bg-[#0f0f1a]"
          : "max-w-2xl"
      }`}
    >
      {isEditing ? (
        <>
          <div className="flex justify-end mb-2">
            <button
              onClick={toggleFullscreen}
              className="text-cyan-400 hover:text-pink-500 transition text-xl"
              aria-label="Toggle Fullscreen"
            >
              {fullscreen ? <FiMinimize /> : <FiMaximize />}
            </button>
          </div>

          <motion.textarea
            ref={textareaRef}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={handleFocus}
            rows={10}
            className="w-full h-[60vh] p-4 text-base bg-[#1a1a2e] text-[#0ff] border border-[#0ff] rounded-lg resize-none shadow-inner focus:outline-none focus:ring-2 focus:ring-[#ff00ff] font-mono"
            placeholder="Click to edit..."
          />

          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-3">
            <button
              onClick={handleCancelClick}
              className="w-full sm:w-auto px-3 py-2 text-base bg-gray-700 text-white hover:bg-gray-600 rounded-lg shadow-md transition disabled:opacity-50"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveClick}
              disabled={isSaving || !text}
              className="w-full sm:w-auto px-3 py-2 text-base bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="whitespace-pre-wrap min-h-[120px] h-[55vh] text-base text-[#0ff] bg-[#1a1a2e] p-4 rounded-lg font-mono hover:ring-1 ring-[#0ff] cursor-text overflow-auto"
          onClick={() => setIsEditing(true)}
        >
          {text || (
            <span className="text-gray-500 italic">Click for start...</span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TextEditor;
