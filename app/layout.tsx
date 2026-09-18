import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

import "./globals.css";
import { cn } from "cn";
import SplashScreen from "@/features/general/components/static/SplashScreen/SplashScreen";

export const metadata: Metadata = {
  title: "Life OS",
  description: "Life OS",
};

const vazirmatn = Vazirmatn({
  subsets: ["latin"],
  variable: "--font-vazirmatn",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("antialiased dark", "font-geist", vazirmatn.variable)}
    >
      <body>
        <SplashScreen>{children}</SplashScreen>
      </body>
    </html>
  );
}
