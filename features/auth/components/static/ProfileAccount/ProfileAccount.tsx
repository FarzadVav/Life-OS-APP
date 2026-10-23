import LogoutBtn from "../../LogoutBtn/LogoutBtn";
import { useCurrentUser } from "@/features/auth/hooks";

function ProfileAccount() {
  const { user: currentUser } = useCurrentUser();

  return (
    <div className="card items-center">
      <div className="size-14 rounded-full bg-card-thick flex items-center justify-center">
        <span className="title">
          {currentUser ? (currentUser.name || currentUser.username)[0] : "*"}
        </span>
      </div>

      <div>
        <p className="title">
          <span>{currentUser?.name || currentUser?.username || "..."}</span>
          {currentUser?.name ? (
            <>
              {" "}
              <span>({currentUser?.username})</span>
            </>
          ) : null}
        </p>
        <p className="sub-text flex items-center">
          Joined at {new Date().toLocaleDateString()}
        </p>
      </div>

      <LogoutBtn />
    </div>
  );
}

export default ProfileAccount;
