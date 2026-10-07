"use client";

import { type Editor } from "@tiptap/react";
import {
  Heading1Icon,
  Heading3Icon,
  PilcrowIcon,
  ListIcon,
  Undo2Icon,
  Redo2Icon,
} from "lucide-react";
import { cn } from "cn";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

type RichTextToolbarProps = {
  editor: Editor | null;
  className?: string;
};

export function RichTextToolbar({ editor, className }: RichTextToolbarProps) {
  const { t } = useLocale();

  if (!editor) {
    return null;
  }

  const isH1Active = editor.isActive("heading", { level: 1 });
  const isH3Active = editor.isActive("heading", { level: 3 });
  const isParagraphActive = editor.isActive("paragraph");
  const isBulletListActive = editor.isActive("bulletList");

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 border-b bg-card/60 px-3 py-2 backdrop-blur-sm",
        className,
      )}
      role="toolbar"
      aria-label={t("editor.toolbar") || "Rich text toolbar"}
    >
      {/* Heading 1 (H1) */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
          isH1Active
            ? "bg-foreground text-background"
            : "bg-card-thick/80 text-foreground/80 hover:bg-card-thick hover:text-foreground",
        )}
        title={t("editor.heading") || "Heading 1"}
        aria-pressed={isH1Active}
      >
        <Heading1Icon className="size-4" />
        <span>{t("editor.heading") || "Heading"}</span>
      </button>

      {/* Title (H3) */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
          isH3Active
            ? "bg-foreground text-background"
            : "bg-card-thick/80 text-foreground/80 hover:bg-card-thick hover:text-foreground",
        )}
        title={t("editor.title") || "Title (H3)"}
        aria-pressed={isH3Active}
      >
        <Heading3Icon className="size-4" />
        <span>{t("editor.title") || "Title"}</span>
      </button>

      {/* Paragraph */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().setParagraph().run();
        }}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
          isParagraphActive
            ? "bg-foreground text-background"
            : "bg-card-thick/80 text-foreground/80 hover:bg-card-thick hover:text-foreground",
        )}
        title={t("editor.paragraph") || "Paragraph"}
        aria-pressed={isParagraphActive}
      >
        <PilcrowIcon className="size-4" />
        <span>{t("editor.paragraph") || "Paragraph"}</span>
      </button>

      {/* Bullet List */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
          isBulletListActive
            ? "bg-foreground text-background"
            : "bg-card-thick/80 text-foreground/80 hover:bg-card-thick hover:text-foreground",
        )}
        title={t("editor.bulletList") || "Bullet List"}
        aria-pressed={isBulletListActive}
      >
        <ListIcon className="size-4" />
        <span>{t("editor.bulletList") || "List"}</span>
      </button>

      <div className="mx-1 h-5 w-px bg-foreground/15" aria-hidden="true" />

      {/* Undo */}
      <button
        type="button"
        disabled={!editor.can().undo()}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().undo().run();
        }}
        className="flex items-center rounded-md p-1.5 text-foreground/70 transition-colors hover:bg-card-thick hover:text-foreground disabled:pointer-events-none disabled:opacity-30 cursor-pointer"
        title={t("editor.undo") || "Undo"}
      >
        <Undo2Icon className="size-4" />
      </button>

      {/* Redo */}
      <button
        type="button"
        disabled={!editor.can().redo()}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().redo().run();
        }}
        className="flex items-center rounded-md p-1.5 text-foreground/70 transition-colors hover:bg-card-thick hover:text-foreground disabled:pointer-events-none disabled:opacity-30 cursor-pointer"
        title={t("editor.redo") || "Redo"}
      >
        <Redo2Icon className="size-4" />
      </button>
    </div>
  );
}

export default RichTextToolbar;
