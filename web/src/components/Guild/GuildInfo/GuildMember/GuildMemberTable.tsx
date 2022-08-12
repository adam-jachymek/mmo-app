import { kickGuildPlayer } from "api/endpoints";
import { Button } from "@mantine/core";
import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "components/ConfirmModal";
import { User } from "/types";

type Props = {
  currentUser: User;
  refetchUser: () => void;
  guild: any;
  refetchGuild: () => void;
  isAdmin: boolean;
  isMod: boolean;
};
const GuildMemberTable = ({
  currentUser,
  refetchUser,
  guild,
  refetchGuild,
  isAdmin,
  isMod,
}: Props) => {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  let navigate = useNavigate();

  const { mutate: kickPlayerGuild } = useMutation(kickGuildPlayer, {
    onSuccess: (response) => {
      refetchGuild();
      refetchUser();
    },
  });

  const notPendingPlayers = guild?.users.filter(
    (user: User) => user.guildRole !== "PENDING"
  );
  return (
    <>
      <div>
        <h2>Guild Members</h2>
        <div className="players">
          <table className="players__info">
            <thead>
              <tr className="players__info-tr">
                <th>Name</th>
                <th>LVL</th>
                <th>Online</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {notPendingPlayers?.map((user: User) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.level}</td>
                  <td>TAK/NIE</td>
                  <td>{user.guildRole}</td>
                  <td>
                    <Button
                      className="players__action-button"
                      color="green"
                      size="xs"
                    >
                      Add Friend
                    </Button>
                    {isMod ||
                      (isAdmin && (
                        <Button
                          className="players__action-button"
                          color="red"
                          size="xs"
                          onClick={() => {
                            kickPlayerGuild({ playerId: user.id });
                          }}
                          // onClick={() => {
                          //   setConfirmModalOpen(true);
                          // }}
                        >
                          Kick
                        </Button>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* <ConfirmModal
        isVisible={confirmModalOpen}
        title={"Do you want kick this player?"}
        onConfirmAction={() => {
          kickPlayerGuild({ playerId: user.id });
          refetchUser();
          refetchGuild();
          navigate("/guild/");
        }}
        onCancelAction={() => setConfirmModalOpen(false)}
      /> */}
    </>
  );
};

export default GuildMemberTable;
