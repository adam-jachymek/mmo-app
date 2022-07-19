import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMobDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  hp?: number;

  @IsNumber()
  @IsOptional()
  minLevel?: number;

  @IsNumber()
  @IsOptional()
  maxLevel?: number;
}
