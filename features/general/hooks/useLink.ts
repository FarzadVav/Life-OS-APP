import { useRouter } from "next/navigation";
import { ButtonClickEvent } from "../components/ui/Button";

function useLink() {
  const router = useRouter();

  const navigate = (
    href: string,
    callBack?: (ev: ButtonClickEvent) => void,
    ev?: ButtonClickEvent,
  ) => {
    router.push(href);

    if (callBack && ev) {
      callBack(ev);
    }
  };

  return { navigate };
}

export default useLink;
