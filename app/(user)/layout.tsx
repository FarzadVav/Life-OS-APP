import Navigation from "@/features/general/components/static/Navigation/Navigation";
import { PropsWithChildren } from "react";

function UserLayout({ children }: PropsWithChildren) {
  return (
    <>
      <main className="h-[calc(100dvh-5rem)]">{children}</main>
      <Navigation />
    </>
  );
}

export default UserLayout;
