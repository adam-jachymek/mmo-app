import { useMutation } from "react-query";
import { healUser } from "api/endpoints";
import { socket } from "api/socket";
import { User } from "/types";
import { Button, RingProgress, Text } from "@mantine/core";
import { removeToken } from "api/token";
import { useState } from "react";
import { Mobile, Default } from "../../utils/mediaQuery";

import "./styles.sass";

type Props = {
  user: User;
  currentUser: User;
  refetchUser: () => void;
};

const TopNavBar = ({ user, currentUser, refetchUser }: Props) => {
  const LogOut = () => {
    removeToken();
    window.location.reload();
  };
  const [sidebar, setSidebar] = useState(false);

  const showSiderbar = () => setSidebar(!sidebar);

  const healMe = () => {
    socket.emit("healUser", {
      userId: user.id,
    });
  };

  const playerExpProgress = () => {
    return (currentUser?.exp / currentUser?.maxExp) * 100;
  };

  return (
    <div className="header">
      <div className="header__info">1200</div>
      <img className="header__gold-icon" src="/media/items/gold.png" />
      <Button
        compact
        color="green"
        className="header__logout"
        onClick={() => {
          healMe();
        }}
      >
        Heal Me
      </Button>
      <Button compact color="red" className="header__logout" onClick={LogOut}>
        Log Out
      </Button>
    </div>
  );
};

export default TopNavBar;
