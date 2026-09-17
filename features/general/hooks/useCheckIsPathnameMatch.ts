import { usePathname } from "next/navigation";

function useCheckIsPathnameMatch() {
  const pn = usePathname();

  const checkIsPathnameMatch = (target: string) => {
    if (target.startsWith("//")) {
      if (pn === `/${target.split("//")[1]}`) {
        return true;
      }
    }

    if (pn.includes(target)) {
      return true;
    }

    return false;
  };

  return checkIsPathnameMatch;
}

export default useCheckIsPathnameMatch;
