import {
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateItemDto {
  @IsNumber()
  @IsNotEmpty()
  itemPrototypeId: number;

  @IsNumber()
  @IsNotEmpty()
  maxLevel: number;
}
