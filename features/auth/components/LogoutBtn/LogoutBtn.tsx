import { LogOutIcon } from "lucide-react";
import { useActionState } from "react";

import { logoutMutation } from "@/features/auth/mutations";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

function LogoutBtn() {
  const { t } = useLocale();
  const [, logoutAction, isLoggingOut] = useActionState(
    logoutMutation,
    undefined,
  );

  return (
    <Dialog
      trigger={
        <Button square variant={"ghost"} className={"ms-auto"}>
          <LogOutIcon />
        </Button>
      }>
      <div className="flex w-full max-w-xs flex-col gap-5 p-1">
        <div className="flex flex-col gap-1">
          <Dialog.Title className="title text-foreground">
            {t("profile.logoutTitle")}
          </Dialog.Title>
          <Dialog.Description className="sub-text">
            {t("profile.logoutDescription")}
          </Dialog.Description>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Dialog.Close
            render={
              <Button
                type="button"
                variant="card"
                className="flex-1"
                disabled={isLoggingOut}>
                {t("common.cancel")}
              </Button>
            }
          />

          <form action={logoutAction} className="flex-1">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoggingOut}>
              {isLoggingOut ? t("common.loading") : t("profile.logout")}
            </Button>
          </form>
        </div>
      </div>
    </Dialog>
  );
}

export default LogoutBtn;
