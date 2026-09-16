import { Vazirmatn } from "next/font/google";

import { cn } from "@/features/general/lib/utils";
import SplashScreen from "../static/SplashScreen/SplashScreen";

const vazirmatn = Vazirmatn({
  subsets: ["latin"],
  variable: "--font-vazirmatn",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("antialiased", "font-geist", vazirmatn.variable)}
    >
      <body>
        <SplashScreen>{children}</SplashScreen>
      </body>
    </html>
  );
}
