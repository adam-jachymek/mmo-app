import { Button, FileInput, Input } from "@mantine/core";
import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { createNpc, getAllNpcs } from "api/endpoints/npc";
import { assets_url } from "config";

const NpcEditor = () => {
  const { data: npcData, refetch: refetchNpc } = useQuery(
    "getAllNpcs",
    getAllNpcs
  );

  const { mutate: addNpc } = useMutation(createNpc, {
    onSuccess: (response) => {
      refetchNpc();
    },
  });

  const npcForm = useFormik({
    initialValues: {
      name: "",
      avatar: "",
    },
    onSubmit: (values, { resetForm }) => {
      addNpc(values);
    },
  });

  return (
    <div className="admin__section">
      <h2 className="admin__title-items">NPCs</h2>
      <form className="admin__form-items" onSubmit={npcForm.handleSubmit}>
        <label className="admin__main-label">Name</label>
        <Input
          className="admin__main-input"
          name="name"
          onChange={npcForm.handleChange}
          value={npcForm.values.name}
        />
        <label className="admin__main-label">Avatar</label>
        <FileInput
          placeholder="Upload sprite"
          name="avatar"
          onChange={(file: any) => {
            npcForm.setFieldValue("avatar", file);
          }}
        />
        <Button m="30px" type="submit" color="green" size="md">
          Add Npc
        </Button>
      </form>
      <table className="admin__item-list">
        <tr className="admin__item-list-tr">
          <th>Name</th>
          <th>Avatar</th>
          <th>Action</th>
        </tr>
        {npcData?.map((npc: any) => (
          <tr key={npc.id} className="admin__item">
            <td>{npc.name}</td>
            <td>
              <img
                alt="avatar"
                style={{ width: 60, height: 60 }}
                src={`${assets_url}/${npc.avatar}`}
              />
            </td>
            <td></td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default NpcEditor;
