import { cn } from "cn";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

import "./globals.css";
import SplashScreen from "@/features/general/components/static/SplashScreen/SplashScreen";
import OfflineBanner from "@/features/general/components/module/OfflineBanner/OfflineBanner";
import PwaManager from "@/features/general/components/module/PwaManager/PwaManager";
import LocaleProvider from "@/features/general/components/module/LocaleProvider/LocaleProvider";
import { getLocale } from "@/features/general/lib/i18n/server";
import { getDictionary } from "@/features/general/lib/i18n/dictionary";

export const viewport: Viewport = {
  themeColor: "#101010",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Arrow Up",
    template: "%s | Arrow Up",
  },
  description: "Personal Operating System for Daily Momentum, Habits & Missions",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Arrow Up",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);

  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"} className={cn("antialiased dark", geist.variable)}>
      <body className="overflow-hidden max-w-3xl mx-auto">
        <LocaleProvider locale={locale} dictionary={dictionary}>
          <OfflineBanner />
          <PwaManager />
          <SplashScreen>{children}</SplashScreen>
        </LocaleProvider>
      </body>
    </html>
  );
}
