import { Button } from "@mantine/core";
import { useMutation } from "react-query";
import { userGuildAccept } from "api/endpoints";
import { User } from "/types";

type Props = {
  guild: any;
  refetchGuild: () => void;
  isAdmin: boolean;
  isMod: boolean;
};

const GuildPendingTable = ({ guild, refetchGuild, isAdmin, isMod }: Props) => {
  const pendingPlayers = guild?.users.filter(
    (user: User) => user.guildRole === "PENDING"
  );

  const { mutate: acceptGuildUser } = useMutation(userGuildAccept, {
    onSuccess: (response) => {
      refetchGuild();
    },
  });

  const isPendingPlayers = pendingPlayers?.length !== 0;

  if ((isPendingPlayers && isMod) || (isPendingPlayers && isAdmin)) {
    return (
      <div>
        <h2>Pending Players</h2>
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
              {pendingPlayers?.map((user: User) => (
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
                      onClick={() => {
                        acceptGuildUser({ playerId: user.id });
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      className="players__action-button"
                      color="red"
                      size="xs"
                    >
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
};

export default GuildPendingTable;
