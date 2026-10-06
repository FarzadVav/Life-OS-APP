import { getTranslations } from "@/features/general/lib/i18n/server";

async function SearchPage() {
  const { t } = await getTranslations();

  return <div>{t("search.title")}</div>;
}

export default SearchPage;
