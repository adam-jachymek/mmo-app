import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMapDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  minLevel: number;

  @IsNumber()
  @IsOptional()
  maxLevel: number;

  @IsNumber()
  @IsOptional()
  numberOfTiles: number;
}
