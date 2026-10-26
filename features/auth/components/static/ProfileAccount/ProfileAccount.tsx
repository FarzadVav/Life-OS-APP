"use client";

import { useCurrentUser } from "@/features/auth/hooks";
import CardView from "@/features/general/components/ui/CardView/CardView";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

function ProfileAccount() {
  const { user: currentUser } = useCurrentUser();
  const { t, formatDate } = useLocale();

  return (
    <CardView
      className="w-full"
      icon={
        <div className="size-12 rounded-full bg-card-thick flex items-center justify-center">
          <span className="title font-bold">
            {currentUser ? (currentUser.name || currentUser.username)[0] : "*"}
          </span>
        </div>
      }
      title={
        <span>
          {currentUser?.name || currentUser?.username || "..."}
          {currentUser?.name ? ` (${currentUser.username})` : null}
        </span>
      }
      description={t("profile.joinedAt", {
        date: formatDate(new Date()),
      })}
    />
  );
}

export default ProfileAccount;
