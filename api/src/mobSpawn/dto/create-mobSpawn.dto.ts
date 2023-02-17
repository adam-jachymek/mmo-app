import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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
}
