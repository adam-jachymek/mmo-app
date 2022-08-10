import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { getGuildById, editGuildById, deleteGuildById } from "api/endpoints";
import { User } from "/types";
import { useForm } from "@mantine/form";
import { useFormik } from "formik";
import GiMagnifyingGlass from "react-icons/gi";
import { Button, Group, Modal, Textarea, TextInput } from "@mantine/core";

type Props = {
  currentUser: User;
  refetchUser: () => void;
};

const GuildInfo = ({ currentUser, refetchUser }: Props) => {
  const { id } = useParams();
  const [opened, setOpened] = useState(false);
  const { data: guild, refetch: refetchGuild } = useQuery(
    ["getGuildById,", id],
    () => getGuildById(id)
  );

  const { mutate: deleteThis } = useMutation(deleteGuildById, {
    onSuccess: (response) => {
      refetchGuild();
      refetchUser();
    },
  });

  const { mutate: guildValues } = useMutation(editGuildById, {
    onSuccess: () => {
      setOpened(false);
      refetchGuild();
      refetchUser();
    },
  });

  // const form = useForm({
  //   initialValues: {
  //     name: "",
  //     description: "",
  //   },

  //   validate: {
  //     name: (value) =>
  //       value.length < 2 ? "Name must have at least 2 letters" : null,
  //     description: (value) =>
  //       value.length < 10 ? "Name must have at least 10 letters" : null,
  //   },
  // });
  const edit = useFormik({
    initialValues: {
      description: guild?.description,
    },
    onSubmit: (values) => {
      guildValues(values);
    },
  });

  const userGuildId = currentUser?.guildId;
  const isAdmin = useMemo(
    () =>
      Number(id) === currentUser?.guildId && currentUser?.guildRole === "ADMIN",
    [id, currentUser]
  );

  const isMod = useMemo(
    () =>
      Number(id) === currentUser?.guildId && currentUser?.guildRole === "MOD",
    [id, currentUser]
  );

  const isMember = useMemo(
    () =>
      Number(id) === currentUser?.guildId &&
      currentUser?.guildRole === "MEMBER",
    [id, currentUser]
  );

  return (
    <div className="guild__info">
      <div>
        <Group position="right">
          {isMod || (isAdmin && <Button color="green">Invite Player</Button>)}
          {isMod || (isMember && <Button>Leave Guild</Button>)}
          {isAdmin && (
            <a href={`/guild/`}>
              <Button color="red" onClick={() => deleteThis(guild.id)}>
                Delete Guild
              </Button>
            </a>
          )}
          <a href={`/guild/`}>
            <Button>Back</Button>
          </a>
        </Group>
      </div>
      <div>
        <div>
          <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Edit Your Guild"
          >
            <form onSubmit={edit.handleSubmit}>
              <Textarea
                label="Description"
                placeholder="Description"
                defaultValue={guild?.description}
                name="description"
                onChange={edit.handleChange}
                value={edit.values.description}
              />
              <Group position="right" mt="md">
                <Button type="submit">Save</Button>
              </Group>
            </form>
          </Modal>

          <div className="">
            <div className="guild__info-title">
              <h3>Name: {guild?.name}</h3>
              <p>Description: {guild?.description}</p>
            </div>
            {isMod ||
              (isAdmin && (
                <Group position="right">
                  <Button onClick={() => setOpened(true)}>Edit</Button>
                </Group>
              ))}
          </div>
        </div>
      </div>
      <div>
        {isMod ||
          (isAdmin && (
            <div>
              <h2>Pending Players</h2>
              <div className="players">
                <table className="players__info">
                  <tr className="players__info-tr">
                    <th>Name</th>
                    <th>LVL</th>
                    <th>Online</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                  {guild?.users?.map((user: any) => (
                    <tr className="">
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
                </table>
              </div>
            </div>
          ))}

        <h2>Guild Members</h2>
        <div className="players">
          <table className="players__info">
            <tr className="players__info-tr">
              <th>Name</th>
              <th>LVL</th>
              <th>Online</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
            {guild?.users?.map((user: any) => (
              <tr className="">
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
                  <Button
                    className="players__action-button"
                    color="yellow"
                    size="xs"
                  >
                    Add to Party
                  </Button>
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuildInfo;
