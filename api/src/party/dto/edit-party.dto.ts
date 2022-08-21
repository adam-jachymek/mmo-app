import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditPartyDto {
  @IsString()
  @IsOptional()
  name?: string;

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
