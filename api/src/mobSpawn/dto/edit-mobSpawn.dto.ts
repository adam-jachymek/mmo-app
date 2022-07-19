import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditMobSpawnDto {
  @IsString()
  @IsOptional()
  hp?: number;
}
