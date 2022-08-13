import {
  ItemQuality,
  ItemType,
} from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  sprite?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  minStat?: number;

  @IsNumber()
  @IsOptional()
  maxStat?: number;

  @IsBoolean()
  @IsOptional()
  isEquipment?: boolean;

  @IsEnum(ItemType)
  @IsOptional()
  type?: ItemType;

  @IsEnum(ItemQuality)
  @IsOptional()
  quality?: ItemQuality;

  @IsString()
  @IsOptional()
  actionName?: string;

  @IsNumber()
  @IsOptional()
  actionAmount?: number;
}
