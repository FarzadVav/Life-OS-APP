"use client";

import { cn } from "cn";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import { Undo2Icon, Redo2Icon } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";

import { RichTextToolbar } from "./RichTextToolbar";
import { Button } from "@/features/general/components/ui/Button/Button";
import { toEditorHtml } from "@/features/general/lib/richText";
import { useLocale } from "../../module/LocaleProvider/LocaleProvider";

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
        orderedList: {
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
          "tiptap-content overflow-y-auto flex-1 outline-none select-text cursor-text text-base leading-relaxed py-2",
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

  const { t } = useLocale();

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
    <>
      <div className={cn("flex flex-col h-[calc(100%-10.5rem)]", className)}>
        {showToolbar ? <RichTextToolbar editor={editor} /> : null}

        <div onClick={() => {
          if (editor && !editor.isFocused) {
            editor.commands.focus("end");
          }
        }}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {editor ? (
        <div className="flex h-14 shrink-0 items-center justify-end gap-3 border-t bg-card/40 px-4 sm:px-6 backdrop-blur-md [&>button]:w-1/2 sticky bottom-14">
          {/* Undo */}
          <Button
            type="button"
            variant="ghost"
            disabled={!editor.can().undo()}
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().undo().run();
            }}
            className="h-auto w-full justify-center rounded-component border p-1.5 text-foreground/70 transition-colors hover:bg-card-thick hover:text-foreground disabled:opacity-30 cursor-pointer"
            title={t("editor.undo") || "Undo"}
          >
            <Undo2Icon className="size-4" />
          </Button>

          {/* Redo */}
          <Button
            type="button"
            variant="ghost"
            disabled={!editor.can().redo()}
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().redo().run();
            }}
            className="h-auto w-full justify-center rounded-component border p-1.5 text-foreground/70 transition-colors hover:bg-card-thick hover:text-foreground disabled:opacity-30 cursor-pointer"
            title={t("editor.redo") || "Redo"}
          >
            <Redo2Icon className="size-4" />
          </Button>
        </div>
      ) : null}
    </>
  );
}

export default RichTextEditor;
