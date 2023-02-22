import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateMobSpawnDto {
  @IsNumber()
  @IsNotEmpty()
  mobId: number;

  @IsNumber()
  @IsNotEmpty()
  minLevel: number;

  @IsNumber()
  @IsNotEmpty()
  maxLevel: number;

  @IsArray()
  @IsOptional()
  dropItemsIds: number[];
}
