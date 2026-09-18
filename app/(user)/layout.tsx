import { PropsWithChildren } from "react";

import Navigation from "@/features/general/components/static/Navigation/Navigation";

function UserLayout({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <Navigation />
    </>
  );
}

export default UserLayout;
