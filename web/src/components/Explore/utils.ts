import { User } from "/types";

export const NUMBER_OF_TILES_IN_AXIS = 20;
export const NUMBER_OF_VISIBLE_TILES = 7;

export const calculateFirstVisibleTile = (user: User) => {
  const tileX =
    user.x - 3 < 0
      ? 0
      : user.x + 3 > NUMBER_OF_TILES_IN_AXIS
      ? NUMBER_OF_TILES_IN_AXIS - NUMBER_OF_VISIBLE_TILES
      : user.x - 3;
  const tileY =
    user.y - 3 < 0
      ? 0
      : user.y + 3 > NUMBER_OF_TILES_IN_AXIS
      ? NUMBER_OF_TILES_IN_AXIS - NUMBER_OF_VISIBLE_TILES
      : user.y - 3;
  const tileIndex = tileY * 20 + tileX;
  return tileIndex;
};
