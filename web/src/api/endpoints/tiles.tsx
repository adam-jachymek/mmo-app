import api from "../axios";
import { Tile } from "/types";

export const createTiles = async (values: { mapId: number }) => {
  const response = await api.post("map_tiles", values);

  return response.data;
};

export const editTileById = async (values: Tile) => {
  const response = await api.patch(`map_tiles/${values.tileId}`, values);

  return response.data;
};

export const updateManyTiles = async (data: {
  ids: number[];
  values: Tile;
}) => {
  delete data.values.tileId;

  const response = await api.post(`map_tiles/many`, data);

  return response.data;
};
