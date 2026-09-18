import { TODOS_LINKS } from "@/features/todos/lib/constant";
import Card from "@/features/general/components/module/Card/Card";

function TodosLinksMap() {
  return (
    <>
      {TODOS_LINKS.map((item) => (
        <Card key={item.id} name={item.name} href={`/habits/${item.id}`} />
      ))}
    </>
  );
}

export default TodosLinksMap;
