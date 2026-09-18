import { HABITS_LINKS } from "@/features/habits/lib/constant";
import Card from "@/features/general/components/module/Card/Card";

function HabitsLinksMap() {
  return (
    <>
      {HABITS_LINKS.map((item) => (
        <Card key={item.id} name={item.name} href={`/habits/${item.id}`} />
      ))}
    </>
  );
}

export default HabitsLinksMap;
