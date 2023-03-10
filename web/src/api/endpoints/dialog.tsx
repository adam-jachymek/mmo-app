import api from "../axios";

export const getAllDialogs = async () => {
  const resposne = await api.get("dialog");

  return resposne.data;
};

export const createDialog = async (values: {
  text: string[];
  npcId?: number;
}) => {
  const response = await api.post("dialog", values);

  return response.data;
};

export const editDialogById = async (data: {
  dialogId: number;
  values: {
    text: string[];
  };
}) => {
  const response = await api.patch(`dialog/${data.dialogId}`, data.values);

  return response.data;
};
