import { redirect } from "next/navigation";

function DefaultPage() {
  return redirect("/todos");
}

export default DefaultPage;
