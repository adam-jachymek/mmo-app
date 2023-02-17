import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditMobDto {
  @IsString()
  @IsOptional()
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
  @IsOptional()
  giveExp: number;

  @IsString()
  @IsOptional()
  sprite: string;
}
