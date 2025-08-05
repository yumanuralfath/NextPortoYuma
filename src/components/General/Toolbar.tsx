"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Image as ImageIcon,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

type ToolbarProps = {
  editor: Editor;
  onImageUpload: (file: File) => void;
};

export const Toolbar = ({ editor, onImageUpload }: ToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setForceUpdate((prev) => prev + 1);
    };

    editor.on("update", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-t-md flex items-center flex-wrap gap-2">
      <ToggleButton
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-5 h-5" />
      </ToggleButton>
      <ToggleButton
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-5 h-5" />
      </ToggleButton>
      <ToggleButton
        isActive={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="w-5 h-5" />
      </ToggleButton>
      <ToggleButton
        isActive={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="w-5 h-5" />
      </ToggleButton>
      <ToggleButton
        isActive={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="w-5 h-5" />
      </ToggleButton>
      <ToggleButton
        isActive={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="w-5 h-5" />
      </ToggleButton>
      <ToggleButton
        isActive={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="w-5 h-5" />
      </ToggleButton>
      <ToggleButton
        isActive={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="w-5 h-5" />
      </ToggleButton>
      <ToggleButton
        isActive={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="w-5 h-5" />
      </ToggleButton>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <ToggleButton onClick={handleImageClick}>
        <ImageIcon className="w-5 h-5" />
      </ToggleButton>
    </div>
  );
};

const ToggleButton = ({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}) => (
  <button
    className={`p-2 rounded-md transition-colors text-gray-700 dark:text-gray-300 ${
      isActive
        ? "bg-gray-300 dark:bg-gray-600"
        : "bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700"
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);
