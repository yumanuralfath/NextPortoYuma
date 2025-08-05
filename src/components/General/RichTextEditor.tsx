/* eslint-disable no-async-promise-executor */
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useCallback, useState } from "react";
import { Toolbar } from "./Toolbar";
import { toast } from "react-hot-toast";

type RichTextEditorProps = {
  initialContent?: string;
  onSave: (content: string) => void;
  isSaving: boolean;
};

export const RichTextEditor = ({
  initialContent = "",
  onSave,
  isSaving,
}: RichTextEditorProps) => {
  const [isModified, setIsModified] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[300px] p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-b-md",
      },
    },
    onUpdate: () => {
      setIsModified(true);
    },
  });

  const handleSave = () => {
    if (editor) {
      onSave(editor.getHTML());
      setIsModified(false);
    }
  };

  const handleCancel = () => {
    if (editor) {
      editor.commands.setContent(initialContent);
      setIsModified(false);
    }
  };

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor) return;

      const uploadPromise = new Promise(async (resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Image upload failed");
          }

          const { url } = await response.json();

          editor.chain().focus().setImage({ src: url }).run();
          resolve(url);
        } catch (error) {
          reject(error);
        }
      });

      toast.promise(uploadPromise, {
        loading: "Uploading image...",
        success: "Image uploaded successfully!",
        error: (err) => err.message || "Failed to upload image.",
      });
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      <Toolbar editor={editor} onImageUpload={handleImageUpload} />
      <EditorContent editor={editor} />
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={isSaving || !isModified}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};
