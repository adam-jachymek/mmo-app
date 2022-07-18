import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditItemDto {
  @IsString()
  @IsNotEmpty()
  stat: number;

  @IsString()
  @IsOptional()
  level?: number;

  @IsString()
  @IsOptional()
  score?: number;
}
