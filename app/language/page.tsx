import { Field } from "@base-ui/react";
import { setLocale } from "@/features/general/actions/locale";
import { Button } from "@/features/general/components/ui/Button/Button";
import { getTranslations } from "@/features/general/lib/i18n/server";

async function LanguagePage() {
  const { locale, t } = await getTranslations();

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-6 p-3">
      <h1 className="title">{t("language.title")}</h1>

      <div className="flex w-full max-w-sm flex-col gap-3">
        {(
          [
            { value: "en", label: t("language.english") },
            { value: "fa", label: t("language.persian") },
          ] as const
        ).map((option) => (
          <form key={option.value} action={setLocale}>
            <Field.Root className="hidden" name="locale">
              <Field.Control type="hidden" name="locale" value={option.value} />
            </Field.Root>
            <Button
              type="submit"
              variant="ghost"
              className={`h-auto w-full justify-start rounded-container bg-card p-3 text-left font-bold hover:bg-card-thick ${
                locale === option.value ? "border border-foreground/40" : ""
              }`}
            >
              {option.label}
            </Button>
          </form>
        ))}
      </div>
    </div>
  );
}

export default LanguagePage;
