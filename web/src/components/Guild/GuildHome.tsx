import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  createGuild,
  getGuilds,
  getGuildById,
  userRequest,
  leaveGuild,
} from "api/endpoints";
import { Button, Group, Modal, TextInput, Textarea } from "@mantine/core";
import { Guild, User } from "/types";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

import "./styles.sass";

type Props = {
  currentUser: User;
  refetchUser: () => void;
};

const GuildHome = ({ currentUser, refetchUser }: Props) => {
  const [opened, setOpened] = useState(false);

  let navigate = useNavigate();

  const { data: guildData, refetch: refetchGuilds } = useQuery(
    "getGuilds",
    getGuilds
  );

  const userGuildId = currentUser?.guildId;

  const { data: yourGuild, refetch: refetchGuild } = useQuery(
    ["yourGuild,", userGuildId],
    () => getGuildById(userGuildId.toString()),
    { enabled: Boolean(userGuildId) }
  );

  const { mutate: joinMe } = useMutation(userRequest, {
    onSuccess: (response) => {
      refetchGuild();
      refetchUser();
    },
  });
  const { mutate: guildValues } = useMutation(createGuild, {
    onSuccess: () => {
      setOpened(false);
      refetchGuilds();
      refetchUser();
    },
  });

  const { mutate: leavePending } = useMutation(leaveGuild, {
    onSuccess: (response) => {
      refetchUser();
      refetchGuild();
    },
  });

  const guildForm = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    onSubmit: (values) => {
      guildValues(values);
    },
  });

  return (
    <div>
      {userGuildId && (
        <div>
          <h3>
            <span>
              {currentUser?.guildRole === "PENDING"
                ? "Pending to: "
                : "Your Guild: "}
            </span>
            {yourGuild?.name}
          </h3>
          <Button
            onClick={() => {
              navigate(`/guild/${yourGuild?.id}`);
            }}
          >
            VIEW GUILD
          </Button>
          {currentUser?.guildRole === "PENDING" && (
            <Button
              style={{ marginLeft: "10px" }}
              color="red"
              onClick={() => {
                leavePending();
              }}
            >
              CANCEL PENDING
            </Button>
          )}
        </div>
      )}
      <div>
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title="Create Your Guild"
        >
          <form onSubmit={guildForm.handleSubmit}>
            <TextInput
              label="Name"
              name="name"
              placeholder="Name your Guild"
              onChange={guildForm.handleChange}
              value={guildForm.values.name}
            />
            <Textarea
              label="Description"
              name="description"
              placeholder="Description"
              onChange={guildForm.handleChange}
              value={guildForm.values.description}
            />
            <Group position="right" mt="md">
              <Button type="submit">Create</Button>
            </Group>
          </form>
        </Modal>
        {!userGuildId && (
          <Group position="right">
            <Button onClick={() => setOpened(true)}>Create Guild</Button>
          </Group>
        )}
      </div>
      <div className="guild">
        <h2 className="guild__title">Guilds</h2>
      </div>
      <div className="guild__table-display">
        <table className="guild__table">
          <thead>
            <tr className="guild__table-tr">
              <th>Name</th>
              <th>Players</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {guildData?.map((guild: Guild) => (
              <tr key={guild.id}>
                <td>{guild.name}</td>
                <td>{guild.usersCount} / 100</td>
                <td>{guild.description}</td>
                <td>
                  {!userGuildId && (
                    <Button
                      color="green"
                      onClick={() => {
                        joinMe(guild.id);
                      }}
                    >
                      Join
                    </Button>
                  )}
                  <Button
                    onClick={() => navigate(`/guild/${guild.id}`)}
                    color="green"
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuildHome;
