import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

import "./globals.css";
import { cn } from "@/features/general/lib/utils";

const vazirmatn = Vazirmatn({
  subsets: ["latin"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "Life OS",
  description: "Life OS",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("antialiased", "font-geist", vazirmatn.variable)}
    >
      <body>{children}</body>
    </html>
  );
}
