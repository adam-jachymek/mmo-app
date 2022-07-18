import "./styles.sass";
import { User } from "/types";

type Props = {
  currentUser: User;
};

const TopNavBar = ({ currentUser }: Props) => {
  const LogOut = () => {
    localStorage.removeItem("userToken");
  };

  return (
    <div className="header">
      <div className="header__info">
        <span>
          Player Name:{" "}
          <span className="header__username">{currentUser?.username}</span>
        </span>
        <button className="header__logout" onClick={LogOut}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default TopNavBar;
