"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Download,
  Share,
  PlusSquare,
  Sparkles,
  Wifi,
  Zap,
  CheckCircle2,
} from "lucide-react";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import { usePwaInstall } from "@/features/general/hooks/usePwaInstall";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

interface InstallAppDialogProps {
  position?: "left" | "right";
  className?: string;
}

export default function InstallAppDialog({
  position = "right",
  className,
}: InstallAppDialogProps) {
  const { isStandalone, isInstallable, isIOS, installApp } = usePwaInstall();
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // Per requirement: must NOT show in installed standalone PWA
  if (isStandalone) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const accepted = await installApp();
      if (accepted) {
        setInstalledSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
        }, 1200);
      }
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <>
      <TopBar.Btn
        position={position}
        onClick={() => setIsOpen(true)}
        className={className}
        aria-label={t("install.aria")}
        title={t("install.label")}
      >
        <span className="relative flex items-center justify-center">
          <Download className="size-5" />
          <span className="absolute -top-0.75 -right-0.75 size-1.5 rounded-full bg-emerald-400" />
        </span>
      </TopBar.Btn>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex flex-col gap-5 max-w-sm w-full p-1">
          {/* Header */}
          <div className="flex items-center gap-3.5">
            <Image
              width={52}
              height={52}
              alt={t("install.title")}
              src="/icons/icon-192x192.png"
              className="size-14 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <Dialog.Title className="title text-foreground">
                {t("install.label")}
              </Dialog.Title>
              <Dialog.Description className="sub-text">
                {t("install.subtitle")}
              </Dialog.Description>
            </div>
          </div>

          {/* Value Highlights */}
          <div className="space-y-6 py-3 text-sm">
            <div className="flex items-start gap-2.5">
              <Zap className="size-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span>{t("install.standaloneTitle")}</span>
                <span className="muted-text ml-1">
                  {t("install.standaloneDesc")}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Wifi className="size-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span>{t("install.offlineTitle")}</span>
                <span className="muted-text ml-1">
                  {t("install.offlineDesc")}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Sparkles className="size-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span>{t("install.quickTitle")}</span>
                <span className="muted-text ml-1">
                  {t("install.quickDesc")}
                </span>
              </div>
            </div>
          </div>

          {/* OS-Specific Instruction or Direct Action */}
          {installedSuccess ? (
            <div className="flex items-center justify-center gap-2 py-3 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="size-5" />
              <span>{t("install.installedSuccess")}</span>
            </div>
          ) : isIOS ? (
            <div className="rounded-2xl border border-foreground/10 bg-background/50 p-3.5 space-y-2.5 text-xs text-foreground/80">
              <p className="font-semibold text-foreground text-xs">{t("install.iosTitle")}</p>
              <div className="flex items-center gap-2.5 text-foreground/70">
                <span className="size-6 rounded-lg bg-foreground/10 flex items-center justify-center shrink-0">
                  <Share className="size-3.5" />
                </span>
                <span>{t("install.iosStep1")}</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground/70">
                <span className="size-6 rounded-lg bg-foreground/10 flex items-center justify-center shrink-0">
                  <PlusSquare className="size-3.5" />
                </span>
                <span>{t("install.iosStep2")}</span>
              </div>
            </div>
          ) : !isInstallable ? (
            <div className="rounded-2xl border border-foreground/10 bg-background/50 p-3 text-xs text-foreground/70">
              <p className="font-medium text-foreground mb-1">{t("install.desktopTitle")}</p>
              <p>
                {t("install.desktopDesc")}
              </p>
            </div>
          ) : null}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3">
            <Dialog.Close
              render={
                <Button
                  type="button"
                  variant="card"
                  className={"flex-1"}
                  onClick={() => setIsOpen(false)}
                >
                  {installedSuccess ? t("common.close") : t("install.later")}
                </Button>
              }
            />

            {isInstallable && !installedSuccess && (
              <Button
                type="button"
                variant="primary"
                className={"flex-1"}
                onClick={handleInstall}
                disabled={isInstalling}
              >
                <span>{isInstalling ? t("install.installing") : t("install.installNow")}</span>
                <Download />
              </Button>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
