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
    <div className="border rounded-lg p-4 bg-white shadow-md max-w-xl">
      {isEditing ? (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            className="w-full p-2 border rounded resize-y"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Simpan
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            className="whitespace-pre-wrap min-h-[100px]"
            onClick={() => setIsEditing(true)}
          >
            {text || (
              <span className="text-gray-400">Klik untuk mulai menulis...</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TextEditor;
