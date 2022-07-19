import api from "./axios";

export const createUser = async (values: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/signup", values);

  localStorage.setItem("userToken", response.data.access_token);

  return response.data;
};

export const loginUser = async (values: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/signin", values);

  localStorage.setItem("userToken", response.data.access_token);

  return response.data;
};

export const getUser = async () => {
  const response = await api.get("/users/me");

  return response.data;
};

export const createItem = async (values: {
  name: string;
  description?: string;
}) => {
  const response = await api.post("/item_prototype/", values);

  return response.data;
};

export const getItems = async () => {
  const response = await api.get("/item/admin");

  return response.data;
};

export const getItemsAdmin = async () => {
  const response = await api.get("/item_prototype");

  return response.data;
};

export const deletePrototypeItem = async (itemId: number) => {
  const response = await api.delete(`/item_prototype/${itemId}`);

  return response.data;
};

export const deleteItem = async (itemId: number) => {
  const response = await api.delete(`/item/${itemId}`);

  return response.data;
};

export const generateItem = async (values: { itemPrototypeId: number }) => {
  const response = await api.post("/item", values);

  return response.data;
};

export const getMobs = async () => {
  const response = await api.get("/mobs");

  return response.data;
};

export const deleteMob = async (mobId: number) => {
  const response = await api.delete(`/item/${mobId}`);

  return response.data;
};

export const createMob = async (values: {
  name: string;
  minLevel?: number;
  maxLevel?: number;
  hp?: number;
  attack?: number;
  defence?: number;
}) => {
  const response = await api.post("/mobs/", values);

  return response.data;
};
