import { getTranslations } from "@/features/general/lib/i18n/server";
import LoginForm from "@/features/auth/components/LoginForm/LoginForm";
import LocaleSwitcher from "@/features/general/components/module/LocaleSwitcher/LocaleSwitcher";
import ThemeSwitcher from "@/features/general/components/module/ThemeSwitcher/ThemeSwitcher";

export default async function LoginPage() {
  const { t } = await getTranslations();

  return (
    <div className="h-dvh px-3 py-6">
      <div className="h-full w-full max-w-160 gap-6 items-center justify-center flex-col flex">
        <div className="w-full flex flex-col gap-6 rounded-container bg-card p-6">
          <p className="w-full sub-text">{t("login.quote")}</p>
          <div className="space-y-1">
            <h1 className="title">{t("login.title")}</h1>
            <p className="sub-text">{t("login.subtitle")}</p>
          </div>

          <LoginForm />
        </div>

        <div className="flex w-full gap-3 *:w-1/2">
          <LocaleSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
