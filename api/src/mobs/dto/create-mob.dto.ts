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
  attack?: number;

  @IsNumber()
  @IsOptional()
  defence?: number;

  @IsNumber()
  @IsNotEmpty()
  giveExp: number;

  @IsString()
  @IsOptional()
  sprite: string;
}
