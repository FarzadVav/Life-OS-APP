import Card from "@/features/general/components/module/Card/Card";
import { JOURNALS_LINKS } from "@/features/journals/lib/constant";

function JournalsLinksMap() {
  return (
    <>
      {JOURNALS_LINKS.map((item) => (
        <Card
          key={item.id}
          name={item.name}
          href={`/journals/${item.id}`}
          description={item.description}
        />
      ))}
    </>
  );
}

export default JournalsLinksMap;
