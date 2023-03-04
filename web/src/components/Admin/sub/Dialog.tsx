import {
  Button,
  Select,
  Switch,
  Textarea,
  Input,
  Loader,
  Collapse,
} from "@mantine/core";
import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { createDialog, getAllDialogs } from "api/endpoints/dialog";
import { useMemo, useState } from "react";
import { getAllNpcs } from "api/endpoints/npc";
import { createDialogOption } from "api/endpoints/options";

const DialogEditor = () => {
  const [addOption, setAddOption] = useState({ show: false, dialogId: 0 });
  const [showAddDialog, setShowAddDialog] = useState(false);

  const {
    data: dialogData,
    refetch: refetchDialog,
    isFetching: isFetchingDialogs,
  } = useQuery("getAllDialogs", getAllDialogs);

  const { data: npcData, isFetching: isFetchingNPCs } = useQuery(
    "getAllNpcs",
    getAllNpcs
  );

  const { mutate: addDialog } = useMutation(createDialog, {
    onSuccess: (response) => {
      refetchDialog();
    },
  });

  const { mutate: addOptions } = useMutation(createDialogOption, {
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

  const optionsForm = useFormik({
    initialValues: {
      text: "",
      dialogId: 0,
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

  const dialogSelect = useMemo(
    () =>
      dialogData?.map((dialog: any) => ({
        label: dialog?.text,
        value: dialog?.id,
      })),
    [dialogData]
  );

  if (isFetchingDialogs || isFetchingNPCs) {
    return <Loader />;
  }

  return (
    <div className="admin__section">
      <h2 className="admin__title-items">Dialogs Editor</h2>
      <Button
        color="green"
        style={{ marginTop: 10 }}
        onClick={() => setShowAddDialog(!showAddDialog)}
      >
        Add new dialog
      </Button>
      <Collapse in={showAddDialog}>
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
            clearable
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
      </Collapse>
      <div className="admin__dialogs">
        {dialogData?.map((dialog: any) => (
          <div key={dialog.id} className="admin__dialog">
            <div className="admin__dialog-info">
              <Input.Wrapper label="Dialog">
                <Input style={{ width: 300 }} value={dialog.text} />
              </Input.Wrapper>
              <Select
                placeholder="Pick one"
                name="Category"
                label="Npc"
                data={npcSelect}
                value={dialog.npcId}
                clearable
                onChange={(value) => {
                  dialogForm.setFieldValue("npcId", value);
                }}
                searchable
                maxDropdownHeight={400}
                nothingFound="No NPCs available"
              />
            </div>
            {addOption.show && dialog.id === addOption.dialogId && (
              <div className="admin__add-dialog-option">
                <Input.Wrapper label="Option">
                  <Input
                    name="text"
                    onChange={dialogForm.handleChange}
                    value={dialogForm.values.text}
                    style={{ width: 300 }}
                  />
                </Input.Wrapper>
                <Select
                  placeholder="Pick one"
                  label="Next dialog"
                  name="Category"
                  data={dialogSelect}
                  clearable
                  onChange={(value) => {}}
                  searchable
                  maxDropdownHeight={400}
                  nothingFound="No NPCs available"
                />
                <Button color="green">Save</Button>
              </div>
            )}
            <Button
              onClick={() => {
                setAddOption({ show: !addOption.show, dialogId: dialog.id });
              }}
              className="admin__add-dialog-option-button"
              compact
            >
              Add option
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DialogEditor;
