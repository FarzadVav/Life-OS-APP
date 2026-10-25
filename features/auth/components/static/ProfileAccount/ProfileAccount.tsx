import LogoutBtn from "../../LogoutBtn/LogoutBtn";
import { useCurrentUser } from "@/features/auth/hooks";
import CardView from "@/features/general/components/ui/CardView/CardView";

function ProfileAccount() {
  const { user: currentUser } = useCurrentUser();

  return (
    <div className="w-full flex items-center gap-2">
      <CardView
        icon={
          <div className="size-12 rounded-full bg-card-thick flex items-center justify-center">
            <span className="title font-bold">
              {currentUser ? (currentUser.name || currentUser.username)[0] : "*"}
            </span>
          </div>
        }
        title={
          <span>
            {currentUser?.name || currentUser?.username || "..."}
            {currentUser?.name ? ` (${currentUser.username})` : null}
          </span>
        }
        description={`Joined at ${new Date().toLocaleDateString()}`}
      />
      <LogoutBtn />
    </div>
  );
}

export default ProfileAccount;
