"use client";

import { cn } from "cn";
import { type Editor } from "@tiptap/react";
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
  const isOrderedListActive = editor.isActive("orderedList");

  return (
    <div
      className={cn(
        "sticky top-0 z-20 shrink-0 flex flex-wrap items-center gap-1.5 border-b bg-card/90 px-3 py-2 backdrop-blur-md",
        className,
      )}
      role="toolbar"
      aria-label={t("editor.toolbar") || "Rich text toolbar"}
    >
      {/* Heading */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        className={cn(
          "rounded-component px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer select-none",
          isH1Active
            ? "bg-foreground text-background"
            : "bg-card-thick/80 text-foreground/80 hover:bg-card-thick hover:text-foreground",
        )}
        title={t("editor.heading") || "Heading"}
        aria-pressed={isH1Active}
      >
        <span>{t("editor.heading") || "Heading"}</span>
      </button>

      {/* Title */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        className={cn(
          "rounded-component px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer select-none",
          isH3Active
            ? "bg-foreground text-background"
            : "bg-card-thick/80 text-foreground/80 hover:bg-card-thick hover:text-foreground",
        )}
        title={t("editor.title") || "Title"}
        aria-pressed={isH3Active}
      >
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
          "rounded-component px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer select-none",
          isParagraphActive
            ? "bg-foreground text-background"
            : "bg-card-thick/80 text-foreground/80 hover:bg-card-thick hover:text-foreground",
        )}
        title={t("editor.paragraph") || "Paragraph"}
        aria-pressed={isParagraphActive}
      >
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
          "rounded-component px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer select-none",
          isBulletListActive
            ? "bg-foreground text-background"
            : "bg-card-thick/80 text-foreground/80 hover:bg-card-thick hover:text-foreground",
        )}
        title={t("editor.bulletList") || "Bullet List"}
        aria-pressed={isBulletListActive}
      >
        <span>{t("editor.bulletList") || "Bullet List"}</span>
      </button>

      {/* Number List */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={cn(
          "rounded-component px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer select-none",
          isOrderedListActive
            ? "bg-foreground text-background"
            : "bg-card-thick/80 text-foreground/80 hover:bg-card-thick hover:text-foreground",
        )}
        title={t("editor.numberList") || "Number List"}
        aria-pressed={isOrderedListActive}
      >
        <span>{t("editor.numberList") || "Number List"}</span>
      </button>
    </div>
  );
}

export default RichTextToolbar;
