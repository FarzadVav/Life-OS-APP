import TopBarBtn from "./TopBarBtn";
import TopBarRoot from "./TopBarRoot";
import TopBarTitle from "./TopBarTitle";
import TopBarCapsule from "./TopBarCapsule";

const TopBar = Object.assign(TopBarRoot, {
  Capsule: TopBarCapsule,
  Title: TopBarTitle,
  Btn: TopBarBtn,
});

export default TopBar;
