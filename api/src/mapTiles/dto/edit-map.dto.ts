import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditMapDto {
  @IsString()
  @IsOptional()
  sprite?: string;

  @IsBoolean()
  @IsOptional()
  blocked?: boolean;

  @IsString()
  @IsOptional()
  text?: string;
}
