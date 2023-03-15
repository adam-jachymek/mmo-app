import {
  IsBoolean,
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

  @IsString()
  @IsOptional()
  layer2?: string;

  @IsString()
  @IsOptional()
  layer3?: string;

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
