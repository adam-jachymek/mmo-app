import api from "../axios";

export const getAllNpcs = async () => {
  const response = await api.get("npc");

  return response.data;
};

export const createNpc = async (values: {
  name: string;
  avatar: string | Blob;
}) => {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("file", values.avatar);

  const response = await api.post("npc", formData);

  return response.data;
};
