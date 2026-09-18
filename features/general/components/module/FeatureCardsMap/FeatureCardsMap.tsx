import FeatureCard from "../FeatureCard/FeatureCard";
import { FeatureCardData, FeaturesAreas } from "@/features/general/lib/types";

type FeatureCardsMapProps = {
  featureArea: FeaturesAreas;
  featureData: FeatureCardData[];
};

function FeatureCardsMap({ featureArea, featureData }: FeatureCardsMapProps) {
  return (
    <>
      {featureData.map((item) => (
        <FeatureCard
          key={item.id}
          name={item.name}
          description={item.description}
          href={`/${featureArea}/${item.categoryId}`}
        />
      ))}
    </>
  );
}

export default FeatureCardsMap;
