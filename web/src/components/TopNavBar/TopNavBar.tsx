import { useMutation } from "react-query";
import { healUser } from "api/endpoints";
import { User } from "/types";
import { Button, RingProgress, Text } from "@mantine/core";
import { removeToken } from "api/token";

import "./styles.sass";
import { useState } from "react";

type Props = {
  currentUser: User;
  refetchUser: () => void;
};

const TopNavBar = ({ currentUser, refetchUser }: Props) => {
  const LogOut = () => {
    removeToken();
    window.location.reload();
  };
  const [sidebar, setSidebar] = useState(false);

  const showSiderbar = () => setSidebar(!sidebar);

  const { mutate: healMe } = useMutation(healUser, {
    onSuccess: (response) => {
      refetchUser();
    },
  });

  const playerExpProgress = () => {
    return (currentUser?.exp / currentUser?.maxExp) * 100;
  };

  return (
    <div className="header">
      <div className="header__info">
        <span>
          <div className="header__user">
            <span className="header__username">{currentUser?.username}</span>
            <RingProgress
              sections={[{ value: playerExpProgress(), color: "blue" }]}
              size={50}
              thickness={4}
              label={
                <Text color="blue" weight={700} align="center" size="xl">
                  {currentUser?.level}
                </Text>
              }
            />
          </div>
        </span>
        <p style={{ marginLeft: "10px" }}>
          {currentUser?.hp < 1
            ? "0"
            : currentUser?.hp + " / " + currentUser?.maxHp + " HP"}
        </p>
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
    </div>
  );
};

export default TopNavBar;
