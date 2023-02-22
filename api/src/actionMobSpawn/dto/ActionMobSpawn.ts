import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class ActionMobSpawnDto {
  @IsNumber()
  @IsOptional()
  mobId: number;

  @IsNumber()
  @IsOptional()
  minLevel: number;

  @IsNumber()
  @IsOptional()
  maxLevel: number;

  @IsNumber()
  @IsOptional()
  spawnRate: number;
}
