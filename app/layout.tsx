import { cn } from "cn";
import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";
import SplashScreen from "@/features/general/components/static/SplashScreen/SplashScreen";

export const metadata: Metadata = {
  title: "Life OS",
  description: "Life OS",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("antialiased dark", geist.variable)}>
      <body className="overflow-hidden">
        <SplashScreen>
          <div className="root">{children}</div>
        </SplashScreen>
      </body>
    </html>
  );
}
