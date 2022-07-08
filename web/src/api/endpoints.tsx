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
  const response = await api.post("/items/", values);

  return response.data;
};

export const getItems = async () => {
  const response = await api.get("/items");

  return response.data;
};
