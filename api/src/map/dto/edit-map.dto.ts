import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditMapDto {
  @IsString()
  @IsOptional()
  name?: string;
}
