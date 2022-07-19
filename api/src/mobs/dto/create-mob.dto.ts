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

  @IsNumber()
  @IsOptional()
  hp?: number;

  @IsNumber()
  @IsOptional()
  minLevel?: number;

  @IsNumber()
  @IsOptional()
  maxLevel?: number;

  @IsNumber()
  @IsOptional()
  attack?: number;

  @IsNumber()
  @IsOptional()
  defence?: number;
}
