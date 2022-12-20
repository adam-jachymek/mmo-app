import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMapDto {
  @IsNumber()
  @IsNotEmpty()
  mapId: number;
}
