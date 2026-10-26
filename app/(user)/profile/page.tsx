import { ProfileLifeAreas } from "@/features/life-areas/components";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import ProfileStats from "@/features/auth/components/static/ProfileStats/ProfileStats";
import ThemeSwitcher from "@/features/general/components/module/ThemeSwitcher/ThemeSwitcher";
import ProfileAccount from "@/features/auth/components/static/ProfileAccount/ProfileAccount";
import LocaleSwitcher from "@/features/general/components/module/LocaleSwitcher/LocaleSwitcher";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import { getTranslations } from "@/features/general/lib/i18n/server";

async function UserProfilePage() {
  const { t } = await getTranslations();

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.InstallBtn position="left" />
        <TopBar.Title asTitle>{t("profile.title")}</TopBar.Title>
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <PageItemsWrapper>
        <ProfileAccount />

        <ProfileLifeAreas />

        <ProfileStats />

        <div className="w-full flex items-center justify-between gap-3 p-3 rounded-container bg-card">
          <span className="font-bold">{t("profile.language")}</span>
          <LocaleSwitcher />
        </div>

        <div className="w-full flex items-center justify-between gap-3 p-3 rounded-container bg-card">
          <span className="font-bold">{t("profile.colorScheme")}</span>
          <ThemeSwitcher />
        </div>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default UserProfilePage;
