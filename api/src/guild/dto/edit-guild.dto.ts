import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditGuildDto {
  @IsNumber()
  @IsOptional()
  userId?: number;
}
