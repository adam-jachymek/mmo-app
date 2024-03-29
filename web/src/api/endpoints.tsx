import api from "./axios";
import { Item } from "types";

export const createUser = async (values: {
  email: string;
  password: string;
  username: string;
  avatar: string;
}) => {
  const response = await api.post("auth/signup", values);

  localStorage.setItem("userToken", response.data.access_token);

  return response.data;
};

export const loginUser = async (values: {
  email: string;
  password: string;
}) => {
  const response = await api.post("auth/signin", values);

  localStorage.setItem("userToken", response.data.access_token);

  return response.data;
};

export const getUser = async () => {
  const response = await api.get("users/me");

  return response.data;
};

export const createItem = async (values: {}) => {
  const response = await api.post("item_prototype", values);

  return response.data;
};

export const getItems = async () => {
  const response = await api.get("item");

  return response.data;
};

export const getAllGeneratedItems = async () => {
  const response = await api.get("item/admin");

  return response.data;
};

export const getItemsAdmin = async () => {
  const response = await api.get("item_prototype");

  return response.data;
};

export const createItemSprite = async (values: {
  itemId: number;
  name: string;
  type: string;
  sprite: string | Blob;
}) => {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("type", values.type);
  formData.append("sprite", values.sprite);

  const response = await api.post(
    `item_prototype/sprite/${values.itemId}`,
    formData
  );

  return response.data;
};

export const createMobSprite = async (values: {
  mobId: number;
  name: string;
  sprite: string | Blob;
}) => {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("sprite", values.sprite);

  const response = await api.post(`mobs/sprite/${values.mobId}`, formData);

  return response.data;
};

export const deletePrototypeItem = async (itemId: number) => {
  const response = await api.delete(`item_prototype/${itemId}`);

  return response.data;
};

export const deleteItem = async (itemId?: number) => {
  const response = await api.delete(`item/${itemId}`);

  return response.data;
};

export const generateItem = async (values: {
  itemPrototypeId: number;
  maxLevel: number;
}) => {
  const response = await api.post("item", values);

  return response.data;
};

export const getMobs = async () => {
  const response = await api.get("mobs");

  return response.data;
};

export const deleteMob = async (mobId: number) => {
  const response = await api.delete(`mobs/${mobId}`);

  return response.data;
};

export const deleteMap = async (mapId: number) => {
  const response = await api.delete(`map/${mapId}`);

  return response.data;
};

export const createMob = async (values: {
  name: string;
  hp?: number;
  attack?: number;
  defence?: number;
  giveExp?: number;
  mapId: number;
}) => {
  const response = await api.post("mobs", values);

  return response.data;
};

export const spawnMob = async (values: { mobId: number }) => {
  const response = await api.post("mob_spawn", values);

  return response.data;
};

export const getSpawnMobById = async (spawnMobId?: string) => {
  const response = await api.get(`mob_spawn/${spawnMobId}`);

  return response.data;
};

export const attackMob = async (spawnMobId?: string) => {
  const response = await api.patch(`mob_spawn/${spawnMobId}`);

  return response.data;
};

export const getMap = async () => {
  const response = await api.get("map");

  return response.data;
};

export const getMapById = async (mapId?: string) => {
  const response = await api.get(`map/${mapId}`);

  return response.data;
};

export const createMap = async (values: {
  name: string;
  minLevel?: number;
  maxLevel?: number;
}) => {
  const response = await api.post("map", values);

  return response.data;
};

export const createBattle = async (values: {
  mobId: number;
  mobMinLevel: number;
  mobMaxLevel: number;
}) => {
  const response = await api.post("battle", values);

  return response.data;
};

export const getBattle = async (battleId?: string) => {
  const response = await api.get(`battle/${battleId}`);

  return response.data.mobSpawn;
};

export const battleTurn = async (battleId: number) => {
  const response = await api.post(`battle/${battleId}`);

  return response.data;
};

export const healUser = async () => {
  const response = await api.post("users/heal");

  return response.data;
};

export const getExplore = async (mapId?: string) => {
  const response = await api.get(`explore/${mapId}`);

  return response.data;
};

export const addLevelPoint = async (values: {
  stamina?: number;
  strength?: number;
  defence?: number;
  dexterity?: number;
  intelligence?: number;
}) => {
  const response = await api.patch("users/points", values);

  return response.data;
};

export const equipItem = async (itemId?: number) => {
  const response = await api.post(`item/equip/${itemId}`);

  return response.data;
};

export const deleteManyItemsByIds = async (itemsIds?: number[]) => {
  const response = await api.post(`item/delete-many`, { itemsIds });

  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("users");

  return response.data;
};
