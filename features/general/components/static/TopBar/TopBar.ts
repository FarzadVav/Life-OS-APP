import TopBarBtn from "./TopBarBtn";
import TopBarRoot from "./TopBarRoot";
import TopBarTitle from "./TopBarTitle";
import InstallAppDialog from "@/features/general/components/module/InstallAppDialog/InstallAppDialog";

const TopBar = Object.assign(TopBarRoot, {
  Title: TopBarTitle,
  Btn: TopBarBtn,
  InstallBtn: InstallAppDialog,
});

export default TopBar;
