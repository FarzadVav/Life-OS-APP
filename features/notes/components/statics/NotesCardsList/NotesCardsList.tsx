import NoteCard from "../../moduels/NoteCard/NoteCard";
import { NOTES_DATA } from "@/features/notes/lib/constants";

function NotesCardsList() {
  return (
    <>
      {NOTES_DATA.map((item) => (
        <NoteCard key={item.id} noteData={item} />
      ))}
    </>
  );
}

export default NotesCardsList;
