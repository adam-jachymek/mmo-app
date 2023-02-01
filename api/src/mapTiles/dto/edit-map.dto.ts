import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
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

  @IsString()
  @IsOptional()
  action_name?: string;

  @IsObject()
  @IsOptional()
  action?: {
    teleport: {
      mapId: string;
      newMapX: number;
      newMaxY: number;
    };
    mobSpawn: { modId: string; procent: number };
  };
}
