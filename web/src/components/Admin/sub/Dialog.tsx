import { Button, Input, Select, Switch, Textarea } from "@mantine/core";
import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { createDialog, getAllDialogs } from "api/endpoints/dialog";
import { useMemo } from "react";
import { getAllNpcs } from "api/endpoints/npc";

const DialogEditor = () => {
  const { data: dialogData, refetch: refetchDialog } = useQuery(
    "getAllDialogs",
    getAllDialogs
  );

  const { data: npcData, refetch: refetchNpc } = useQuery(
    "getAllNpcs",
    getAllNpcs
  );

  const { mutate: addDialog } = useMutation(createDialog, {
    onSuccess: (response) => {
      refetchDialog();
    },
  });

  const dialogForm = useFormik({
    initialValues: {
      name: "",
      text: "",
      isStart: false,
      isEnd: false,
      npcId: 0,
    },
    onSubmit: (values, { resetForm }) => {
      addDialog(values);
    },
  });

  const npcSelect = useMemo(
    () =>
      npcData?.map((npc: any) => ({
        label: npc?.name,
        value: npc?.id,
      })),
    [npcData]
  );

  return (
    <div className="admin__section">
      <h2 className="admin__title-items">Dialogs Editor</h2>
      <form className="admin__form-items" onSubmit={dialogForm.handleSubmit}>
        <label className="admin__main-label">Text</label>
        <Textarea
          name="text"
          onChange={dialogForm.handleChange}
          value={dialogForm.values.text}
        />
        <label className="admin__main-label">isStart</label>
        <Switch
          onChange={(event) =>
            dialogForm.setFieldValue("isStart", event.currentTarget.checked)
          }
          disabled={dialogForm.values.isEnd}
        />
        <label className="admin__main-label">isEnd</label>
        <Switch
          onChange={(event) =>
            dialogForm.setFieldValue("isEnd", event.currentTarget.checked)
          }
          disabled={dialogForm.values.isStart}
        />
        <label className="admin__main-label">Npc</label>
        <Select
          placeholder="Pick one"
          name="Category"
          data={npcSelect}
          style={{ marginBottom: 10 }}
          onChange={(value) => {
            dialogForm.setFieldValue("npcId", value);
          }}
          searchable
          maxDropdownHeight={400}
          nothingFound="No NPCs available"
        />
        <Button m="30px" type="submit" color="green" size="md">
          Add Dialog
        </Button>
      </form>
      <table className="admin__item-list">
        <tr className="admin__item-list-tr">
          <th>Text</th>
          <th>isStart</th>
          <th>isEnd</th>
          <th>NPC</th>
        </tr>
        {dialogData?.map((dialog: any) => (
          <tr key={dialog.id} className="admin__item">
            <td>{dialog.text}</td>
            <td>{dialog.isStart.toString()}</td>
            <td>{dialog.isEnd.toString()}</td>
            <td>{dialog.npcId}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default DialogEditor;
