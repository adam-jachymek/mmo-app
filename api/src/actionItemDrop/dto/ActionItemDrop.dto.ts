import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class ActionItemDropDto {
  @IsNumber()
  @IsOptional()
  actionMobSpawnId: number;

  @IsNumber()
  @IsOptional()
  mapTileId: number;

  @IsNumber()
  @IsOptional()
  itemId: number;

  @IsNumber()
  @IsOptional()
  dropRate: number;
}
