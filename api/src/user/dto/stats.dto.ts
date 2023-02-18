import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class StatsUserDto {
  @IsNumber()
  @IsOptional()
  stamina?: number;

  @IsNumber()
  @IsOptional()
  strength?: number;

  @IsNumber()
  @IsOptional()
  defence?: number;

  @IsNumber()
  @IsOptional()
  dexterity?: number;

  @IsNumber()
  @IsOptional()
  intelligence?: number;
}
