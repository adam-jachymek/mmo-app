import api from "../axios";

export const getAllSprites = async () => {
  const response = await api.get("/map_sprites");

  return response.data;
};

export const createSprite = async (data: {
  values: {
    name: string;
    category: string;
  };
  file: string | Blob;
}) => {
  const formData = new FormData();

  formData.append("name", data.values.name);
  formData.append("category", data.values.category);
  formData.append("file", data.file);

  const response = await api.post("/map_sprites", formData);

  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/map_sprites/categories");

  return response.data;
};

export const deleteMapSprite = async (spriteId: number) => {
  const response = await api.delete(`/map_sprites/${spriteId}`);

  return response.data;
};
