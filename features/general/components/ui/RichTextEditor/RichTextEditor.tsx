"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "cn";
import { RichTextToolbar } from "./RichTextToolbar";
import { toEditorHtml } from "@/features/general/lib/richText";

export type RichTextEditorProps = {
  value: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  showToolbar?: boolean;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
  autoFocus = true,
  showToolbar = true,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Write your content here...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: toEditorHtml(value),
    autofocus: autoFocus,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "tiptap-content min-h-[320px] outline-none select-text cursor-text text-base leading-relaxed py-2",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      if (!onChange) return;
      if (currentEditor.isEmpty) {
        onChange("");
      } else {
        onChange(currentEditor.getHTML());
      }
    },
  });

  // Keep content in sync if value changed from outside
  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.isEmpty ? "" : editor.getHTML();
    const normalizedNew = toEditorHtml(value);
    if (value !== currentHtml && normalizedNew !== currentHtml) {
      editor.commands.setContent(normalizedNew || "");
    }
  }, [value, editor]);

  return (
    <div className={cn("flex flex-1 flex-col overflow-hidden", className)}>
      {showToolbar ? <RichTextToolbar editor={editor} /> : null}

      <div
        className="flex-1 overflow-y-auto px-4 py-6 md:px-8 cursor-text"
        onClick={() => {
          if (editor && !editor.isFocused) {
            editor.commands.focus("end");
          }
        }}
      >
        <div className="mx-auto max-w-3xl min-h-full">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}

export default RichTextEditor;
