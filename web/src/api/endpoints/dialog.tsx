import api from "../axios";

export const getAllDialogs = async () => {
  const resposne = await api.get("dialog");

  return resposne.data;
};

export const createDialog = async (values: {
  name?: string;
  text: string;
  isStart?: boolean;
  isEnd?: boolean;
  npcId?: number;
}) => {
  const response = await api.post("dialog", values);

  return response.data;
};
