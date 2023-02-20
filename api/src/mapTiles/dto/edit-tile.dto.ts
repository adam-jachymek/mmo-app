import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditTileDto {
  @IsString()
  @IsOptional()
  sprite?: string;

  @IsString()
  @IsOptional()
  object?: string;

  @IsBoolean()
  @IsOptional()
  blocked?: boolean;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  action_name?: string;
}
