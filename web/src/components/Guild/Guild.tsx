import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  createGuild,
  getGuilds,
  getGuildById,
  userRequest,
} from "api/endpoints";
import { useForm } from "@mantine/form";
import { Button, Group, Modal, TextInput, Textarea } from "@mantine/core";
import { useParams } from "react-router-dom";
import { User } from "/types";

import "./styles.sass";

type Props = {
  currentUser: User;
  refetchUser: () => void;
};

const Guild = ({ currentUser, refetchUser }: Props) => {
  const [opened, setOpened] = useState(false);

  const { data: guildData, refetch: refetchGuilds } = useQuery(
    "getGuilds",
    getGuilds
  );

  const userGuildId = currentUser?.guildId;

  const { data: guild, refetch: refetchGuild } = useQuery(
    ["getGuildById,", userGuildId],
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

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      description: (value) =>
        value.length < 10 ? "Name must have at least 10 letters" : null,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    guildValues(values);
  };

  return (
    <div>
      {userGuildId && (
        <div>
          <h3>Your Guild: {guild?.name}</h3>
          <a href={`/guild/${guild?.id}`}>
            <Button>VIEW GUILD</Button>
          </a>
        </div>
      )}
      <div>
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title="Create Your Guild"
        >
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Name"
              placeholder="Name your Guild"
              {...form.getInputProps("name")}
            />
            <Textarea
              label="Description"
              placeholder="Description"
              {...form.getInputProps("description")}
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
          <tr className="guild__table-tr">
            <th>Name</th>
            <th>Players</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
          {guildData?.map((guild: any) => (
            <tr>
              <td>{guild.name}</td>
              <td>{guild?.users.length} / 100</td>
              <td>{guild.description}</td>
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
              <a href={`/guild/${guild.id}`}>
                <Button color="green">View</Button>
              </a>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default Guild;
