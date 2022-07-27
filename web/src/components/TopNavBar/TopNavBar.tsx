import { useMutation } from "react-query";
import "./styles.sass";
import { healUser } from "api/endpoints";
import { User } from "/types";
import { HPlusMobiledata } from "@mui/icons-material";

type Props = {
  currentUser: User;
  refetchUser: any;
};

const TopNavBar = ({ currentUser, refetchUser }: Props) => {
  const LogOut = () => {
    localStorage.removeItem("userToken");
  };

  const { mutate: healMe } = useMutation(healUser, {
    onSuccess: (response) => {
      refetchUser();
    },
  });

  return (
    <div className="header">
      <div className="header__info">
        <span>
          Player Name:{" "}
          <span className="header__username">{currentUser?.username}</span>
        </span>
        <p style={{ marginLeft: "10px" }}>
          {currentUser?.hp < 1 ? "0" : currentUser?.hp}HP
        </p>
        <button
          className="header__logout"
          onClick={() => {
            healMe();
          }}
        >
          Heal Me
        </button>
        <button className="header__logout" onClick={LogOut}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default TopNavBar;
