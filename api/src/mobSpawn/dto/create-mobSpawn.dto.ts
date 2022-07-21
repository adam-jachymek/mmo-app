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
}
