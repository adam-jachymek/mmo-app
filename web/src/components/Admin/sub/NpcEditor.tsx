import { Button, Select, Input, Loader, FileInput } from "@mantine/core";
import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { createDialog, editDialogById } from "api/endpoints/dialog";
import { useState } from "react";
import { createNpc, getAllNpcs } from "api/endpoints/npc";
import { createDialogOption } from "api/endpoints/options";
import { assets_url } from "../../../config";
import { Dialog, DialogOption, NPC } from "/types";

const NpcEditor = () => {
  const [addToDialog, setAddToDialog] = useState<{
    optionsDialogId: number | null;
    paragraphDialogId: number | null;
    nextDialogDialogId: number | null;
  }>({
    optionsDialogId: null,
    paragraphDialogId: null,
    nextDialogDialogId: null,
  });

  const {
    data: npcData,
    isFetching: isFetchingNPCs,
    refetch: refetchNpc,
  } = useQuery("getAllNpcs", getAllNpcs);

  const { mutate: addNpc } = useMutation(createNpc, {
    onSuccess: (response) => {
      refetchNpc();
    },
  });

  const { mutate: addDialog } = useMutation(createDialog, {
    onSuccess: (response) => {
      refetchNpc();
    },
  });

  const { mutate: editDialog } = useMutation(editDialogById, {
    onSuccess: (response) => {
      refetchNpc();
    },
  });

  const { mutate: addOptions } = useMutation(createDialogOption, {
    onSuccess: (response) => {
      refetchNpc();
    },
  });

  console.log("npcData", npcData);

  const npcForm = useFormik({
    initialValues: {
      name: "",
      avatar: "",
    },
    onSubmit: (values, { resetForm }) => {
      addNpc(values);
      resetForm();
    },
  });

  const dialogForm = useFormik({
    initialValues: {
      text: "",
      npcId: 0,
    },
    onSubmit: (values, { resetForm }) => {
      const parseValues = {
        ...values,
        text: [values.text],
      };

      addDialog(parseValues);
      resetForm();
    },
  });

  const dialogEditForm = useFormik({
    initialValues: {
      text: "",
      previousText: [],
      dialogId: 0,
    },
    onSubmit: (values, { resetForm }) => {
      editDialog({
        dialogId: values.dialogId,
        values: { text: [...values.previousText, values.text] },
      });
      resetForm();
    },
  });

  const addNextDialogForm = useFormik({
    initialValues: {
      dialogId: 0,
      nextId: 0,
    },
    onSubmit: (values, { resetForm }) => {
      editDialog({
        dialogId: values.dialogId,
        values: { nextId: values.nextId },
      });
      resetForm();
    },
  });

  const optionsForm = useFormik({
    initialValues: {
      text: "",
      dialogId: 0,
      nextDialogId: 0,
    },
    onSubmit: (values, { resetForm }) => {
      addOptions(values);
      resetForm();
    },
  });

  const dialogSelect = (dialog: Dialog[]) =>
    dialog?.map((dialog: any) => ({
      label: dialog?.text[0],
      value: dialog?.id,
    }));

  if (isFetchingNPCs) {
    return <Loader />;
  }

  return (
    <div className="admin__section">
      <h2 className="admin__title-items">NPC Editor</h2>
      <div className="admin__npc-wrapper">
        {npcData?.map((npc: NPC) => (
          <div className="admin__npc">
            <p>{npc?.name}</p>
            <img
              className="admin__npc-avatar"
              src={`${assets_url}/${npc.avatar}`}
            />
            <div className="admin__dialogs">
              {npc.dialog?.map((dialog: Dialog) => (
                <div key={dialog.id} className="admin__dialog">
                  <p className="admin__dialog-label">Dialog</p>
                  {dialog.text?.map((text: string) => (
                    <div className="admin__dialog-info-paragraph">
                      <Input
                        style={{ width: 600, marginBottom: 10 }}
                        value={text}
                      />
                    </div>
                  ))}
                  {dialog?.next && (
                    <Input.Wrapper label="Next dialog">
                      <Input
                        style={{ width: 600, marginBottom: 10 }}
                        value={dialog?.next?.text[0]}
                      />
                    </Input.Wrapper>
                  )}
                  {addToDialog.paragraphDialogId === dialog.id && (
                    <div className="admin__dialog-add-paragraph">
                      <form onSubmit={dialogEditForm.handleSubmit}>
                        <Input.Wrapper label="New paragraph">
                          <Input
                            name="text"
                            style={{ width: "100%", marginBottom: 10 }}
                            onChange={dialogEditForm.handleChange}
                            value={dialogEditForm.values.text}
                          />
                        </Input.Wrapper>
                        <div className="admin__add-dialog-option-buttons">
                          <Button
                            onClick={() => {
                              dialogEditForm.setFieldValue(
                                "previousText",
                                dialog.text?.map((dialog: string) => dialog)
                              );
                              dialogEditForm.setFieldValue(
                                "dialogId",
                                dialog.id
                              );
                            }}
                            style={{ width: "50%" }}
                            type="submit"
                            color="green"
                            compact
                          >
                            Add Paragraph
                          </Button>
                          <Button
                            onClick={() =>
                              setAddToDialog({
                                ...addToDialog,
                                paragraphDialogId: null,
                              })
                            }
                            style={{ width: "50%" }}
                            type="button"
                            color="red"
                            compact
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}

                  {addToDialog.optionsDialogId === dialog.id && (
                    <form
                      className="admin__add-dialog-option"
                      onSubmit={optionsForm.handleSubmit}
                    >
                      <Input.Wrapper label="Option">
                        <Input
                          name="text"
                          onChange={optionsForm.handleChange}
                          value={optionsForm.values.text}
                          style={{ width: "100%" }}
                        />
                      </Input.Wrapper>
                      <Select
                        className="admin__add-dialog-option-select"
                        placeholder="Pick one"
                        label="Next dialog"
                        name="Category"
                        data={dialogSelect(npc.dialog)}
                        clearable
                        onChange={(value) => {
                          optionsForm.setFieldValue("nextDialogId", value);
                        }}
                        searchable
                        maxDropdownHeight={400}
                        nothingFound="No NPCs available"
                      />
                      <div className="admin__add-dialog-option-buttons">
                        <Button
                          onClick={() => {
                            optionsForm.setFieldValue("dialogId", dialog.id);
                          }}
                          style={{ width: "50%" }}
                          type="submit"
                          color="green"
                          compact
                        >
                          Add Option
                        </Button>
                        <Button
                          onClick={() =>
                            setAddToDialog({
                              ...addToDialog,
                              optionsDialogId: null,
                            })
                          }
                          style={{ width: "50%" }}
                          type="submit"
                          color="red"
                          compact
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                  {addToDialog.nextDialogDialogId === dialog.id && (
                    <form
                      className="admin__add-dialog-option"
                      onSubmit={addNextDialogForm.handleSubmit}
                    >
                      <Select
                        className="admin__add-dialog-option-select"
                        placeholder="Pick one"
                        label="Next dialog"
                        name="Category"
                        data={dialogSelect(npc.dialog)}
                        clearable
                        onChange={(value) => {
                          addNextDialogForm.setFieldValue("nextId", value);
                        }}
                        searchable
                        maxDropdownHeight={400}
                        nothingFound="No NPCs available"
                      />
                      <div className="admin__add-dialog-option-buttons">
                        <Button
                          onClick={() => {
                            addNextDialogForm.setFieldValue(
                              "dialogId",
                              dialog.id
                            );
                          }}
                          style={{ width: "50%" }}
                          type="submit"
                          color="green"
                          compact
                        >
                          Add next dialog
                        </Button>
                        <Button
                          onClick={() =>
                            setAddToDialog({
                              ...addToDialog,
                              nextDialogDialogId: null,
                            })
                          }
                          style={{ width: "50%" }}
                          type="submit"
                          color="red"
                          compact
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}

                  {!Object.values(addToDialog).includes(dialog.id) && (
                    <div className="admin__dialog-buttons">
                      <Button
                        className="admin__add-paragraph-option-button"
                        compact
                        onClick={() =>
                          setAddToDialog({
                            ...addToDialog,
                            paragraphDialogId: dialog.id,
                          })
                        }
                      >
                        Add paragraph
                      </Button>
                      <Button
                        className="admin__add-paragraph-option-button"
                        compact
                        onClick={() =>
                          setAddToDialog({
                            ...addToDialog,
                            nextDialogDialogId: dialog.id,
                          })
                        }
                      >
                        Add next dialog
                      </Button>
                      <Button
                        compact
                        onClick={() => {
                          setAddToDialog({
                            ...addToDialog,
                            optionsDialogId: dialog.id,
                          });
                        }}
                        className="admin__add-dialog-option-button"
                      >
                        Add option
                      </Button>
                    </div>
                  )}
                  {dialog?.options?.map((option: DialogOption) => (
                    <div className="admin__dialog-option">
                      <Input.Wrapper style={{ width: "50%" }} label="Option">
                        <Input value={option.text} />
                      </Input.Wrapper>
                      <Input.Wrapper
                        style={{ width: "50%" }}
                        label="Next Dialog"
                      >
                        <Input value={option.nextDialog.text[0]} />
                      </Input.Wrapper>
                    </div>
                  ))}
                </div>
              ))}
              <form
                className="admin__dialog-add-new"
                onSubmit={dialogForm.handleSubmit}
              >
                <Input.Wrapper label="New dialog">
                  <Input
                    name="text"
                    onChange={dialogForm.handleChange}
                    value={dialogForm.values.text}
                    style={{ width: 500 }}
                  />
                </Input.Wrapper>
                <Button
                  onClick={() => dialogForm.setFieldValue("npcId", npc.id)}
                  type="submit"
                  color="green"
                >
                  Add Dialog
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
      <form className="admin__npc-add-form" onSubmit={npcForm.handleSubmit}>
        <p className="admin__npc-add-form-label">Add new NPC</p>
        <div className="admin__npc-add-form-wrapper">
          <Input.Wrapper label="Name">
            <Input
              name="name"
              onChange={npcForm.handleChange}
              value={npcForm.values.name}
            />
          </Input.Wrapper>
          <FileInput
            placeholder="Upload sprite"
            name="avatar"
            label="Avatar"
            onChange={(file: any) => {
              npcForm.setFieldValue("avatar", file);
            }}
          />
          <Button type="submit" color="green">
            Add NPC
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NpcEditor;
