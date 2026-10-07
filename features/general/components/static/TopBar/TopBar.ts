import TopBarBtn from "./TopBarBtn";
import TopBarRoot from "./TopBarRoot";
import TopBarTitle from "./TopBarTitle";
import InstallAppDialog from "@/features/general/components/module/InstallAppDialog/InstallAppDialog";
import HelpDialog from "@/features/general/components/module/HelpDialog/HelpDialog";

const TopBar = Object.assign(TopBarRoot, {
  Title: TopBarTitle,
  Btn: TopBarBtn,
  InstallBtn: InstallAppDialog,
  HelpBtn: HelpDialog,
  Help: HelpDialog,
});

export default TopBar;
