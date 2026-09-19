import { cn } from "cn";
import { ComponentProps } from "react";
import { EditIcon, Trash2Icon } from "lucide-react";

import { Note } from "@/features/notes/lib/types";
import { Button } from "@/features/general/components/ui/Button";

type NoteCardProps = ComponentProps<"div"> & {
  noteData: Note;
};

function NoteCard({ noteData, className, ...p }: NoteCardProps) {
  return (
    <div
      className={cn("p-3 rounded-xl bg-card flex flex-col gap-1.5", className)}
      {...p}
    >
      <p>{noteData.content}</p>
      <div className="flex items-center flex-1 gap-1.5 py-3 [&_p]:text-xs">
        <p className="opacity-50">
          {new Date(noteData.createdAt).toLocaleDateString() + ", "}
        </p>
        <p>
          {new Date(noteData.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center justify-center flex-1 gap-3 [&_>_button]:flex-1/2">
        <Button variant={"ghost"}>
          <EditIcon />
        </Button>
        <Button variant={"ghost"}>
          <Trash2Icon />
        </Button>
      </div>
    </div>
  );
}

export default NoteCard;
