import api from "../axios";

export const getAllDialogOptions = async () => {
  const response = await api.get("dialog-option");

  return response.data;
};

export const getDialogOptionsByDialogId = async (dialogId: number) => {
  const response = await api.get(`dialog-option/dialog/${dialogId}`);

  return response.data;
};

export const createDialogOption = async (values: {
  text: string;
  dialogId?: number;
  nextDialogId?: number;
}) => {
  const response = await api.post("dialog-option", values);

  return response.data;
};
