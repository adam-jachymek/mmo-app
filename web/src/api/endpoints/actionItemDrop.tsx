import api from "../axios";

export const getActionDropItem = async (actionMobId?: number) => {
  const response = await api.get(`action_item_drop/${actionMobId?.toString()}`);

  return response.data;
};

export const createActionItemDrop = async (data: {
  values: {
    itemId?: string;
    dropRate?: number;
    quantityMin?: number;
    quantityMax?: number;
  };
  actionMobId?: number;
}) => {
  const response = await api.post(
    `action_item_drop/${data.actionMobId?.toString()}`,
    data.values
  );

  return response.data;
};

export const updateActionItemDrop = async (data: {
  values: {
    id?: number;
    itemId?: string;
    dropRate?: number;
    quantityMin?: number;
    quantityMax?: number;
  };
  actionMobId?: number;
}) => {
  const response = await api.patch(
    `action_item_drop/${data.actionMobId?.toString()}/${data.values.id}`,
    data.values
  );

  return response.data;
};

export const deleteActionItemDrop = async (actionDropId?: number) => {
  const response = await api.delete(
    `action_item_drop/${actionDropId?.toString()}`
  );

  return response.data;
};
