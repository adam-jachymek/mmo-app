import { Button, Group, Modal, Textarea } from "@mantine/core";
import { useFormik } from "formik";
import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { deleteGuildById, editGuildById, leaveGuild } from "api/endpoints";
import ConfirmModal from "components/ConfirmModal";
import { User } from "/types";

type Props = {
  currentUser: User;
  refetchUser: () => void;
  guild: any;
  refetchGuild: () => void;
  isAdmin: boolean;
  isMod: boolean;
  isMember: boolean;
};

const GuildHeader = ({
  currentUser,
  refetchUser,
  guild,
  refetchGuild,
  isAdmin,
  isMod,
  isMember,
}: Props) => {
  const [opened, setOpened] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  let navigate = useNavigate();

  const { mutate: deleteThis } = useMutation(deleteGuildById, {
    onSuccess: (response) => {
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

  const { mutate: leaveThisGuild } = useMutation(leaveGuild, {
    onSuccess: (response) => {
      refetchUser();
      refetchGuild();
    },
  });

  const edit = useFormik({
    initialValues: {
      description: guild?.description,
    },
    onSubmit: (values) => {
      guildValues(values);
    },
  });

  const isPlayerPending = currentUser?.guildRole === "PENDING";

  return (
    <>
      <div>
        {isPlayerPending && (
          <div
            style={{
              backgroundColor: "#2f9e44",
              padding: "10px",
              color: "#fff",
              textAlign: "center",
              borderRadius: "10px",
              marginBottom: "20px ",
            }}
          >
            YOU ARE PENDING TO THIS GUILD!
          </div>
        )}
        <Group position="right">
          {isMod || (isAdmin && <Button color="green">Invite Player</Button>)}
          {isMod ||
            (isMember && (
              <Button color="red" onClick={() => leaveThisGuild()}>
                Leave Guild
              </Button>
            ))}
          {isAdmin && (
            <Button
              color="red"
              onClick={() => {
                setConfirmModalOpen(true);
              }}
            >
              Delete Guild
            </Button>
          )}
          <Button
            onClick={() => {
              navigate("/guild");
            }}
          >
            Back
          </Button>
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
      <ConfirmModal
        isVisible={confirmModalOpen}
        title={"Do you want delete this guild?"}
        onConfirmAction={() => {
          deleteThis(guild.id);
          refetchUser();
          refetchGuild();
          navigate("/guild");
        }}
        onCancelAction={() => setConfirmModalOpen(false)}
      />
    </>
  );
};

export default GuildHeader;
