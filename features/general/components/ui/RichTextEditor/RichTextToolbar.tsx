"use client";

import { cn } from "cn";
import { type Editor } from "@tiptap/react";
import { BoldIcon } from "lucide-react";
import { Button } from "@/features/general/components/ui/Button/Button";
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
  const isBoldActive = editor.isActive("bold");
  const isBulletListActive = editor.isActive("bulletList");
  const isOrderedListActive = editor.isActive("orderedList");

  const chipClasses = (active: boolean) =>
    cn(
      "h-auto rounded-component px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer [&_svg]:size-3.5",
      active
        ? "bg-foreground text-background"
        : "bg-card-thick/80 text-foreground/80 hover:bg-card-thick hover:text-foreground",
    );

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
      <Button
        type="button"
        variant="ghost"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        className={chipClasses(isH1Active)}
        title={t("editor.heading") || "Heading"}
        aria-pressed={isH1Active}
      >
        <span>{t("editor.heading") || "Heading"}</span>
      </Button>

      {/* Title */}
      <Button
        type="button"
        variant="ghost"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        className={chipClasses(isH3Active)}
        title={t("editor.title") || "Title"}
        aria-pressed={isH3Active}
      >
        <span>{t("editor.title") || "Title"}</span>
      </Button>

      {/* Paragraph */}
      <Button
        type="button"
        variant="ghost"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().setParagraph().run();
        }}
        className={chipClasses(isParagraphActive)}
        title={t("editor.paragraph") || "Paragraph"}
        aria-pressed={isParagraphActive}
      >
        <span>{t("editor.paragraph") || "Paragraph"}</span>
      </Button>

      {/* Bold */}
      <Button
        type="button"
        variant="ghost"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={cn(chipClasses(isBoldActive), "gap-1")}
        title={t("editor.bold") || "Bold"}
        aria-pressed={isBoldActive}
      >
        <BoldIcon />
        <span>{t("editor.bold") || "Bold"}</span>
      </Button>

      {/* Bullet List */}
      <Button
        type="button"
        variant="ghost"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={chipClasses(isBulletListActive)}
        title={t("editor.bulletList") || "Bullet List"}
        aria-pressed={isBulletListActive}
      >
        <span>{t("editor.bulletList") || "Bullet List"}</span>
      </Button>

      {/* Number List */}
      <Button
        type="button"
        variant="ghost"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={chipClasses(isOrderedListActive)}
        title={t("editor.numberList") || "Number List"}
        aria-pressed={isOrderedListActive}
      >
        <span>{t("editor.numberList") || "Number List"}</span>
      </Button>
    </div>
  );
}

export default RichTextToolbar;
