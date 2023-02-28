import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ArmorType,
  ItemQuality,
  ItemType,
  MainType,
  WeaponType,
} from '@prisma/client';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  minAttack?: number;

  @IsNumber()
  @IsOptional()
  maxAttack?: number;

  @IsNumber()
  @IsOptional()
  stamina?: number;

  @IsNumber()
  @IsOptional()
  defence?: number;

  @IsNumber()
  @IsOptional()
  strenght?: number;

  @IsNumber()
  @IsOptional()
  dexterity?: number;

  @IsNumber()
  @IsOptional()
  intelligence?: number;

  @IsBoolean()
  @IsOptional()
  isEquipment?: boolean;

  @IsEnum(MainType)
  @IsOptional()
  mainType?: MainType;

  @IsEnum(WeaponType)
  @IsOptional()
  weaponType?: WeaponType;

  @IsEnum(ArmorType)
  @IsOptional()
  armorType?: ArmorType;

  @IsEnum(ItemType)
  @IsOptional()
  itemType?: ItemType;

  @IsEnum(ItemQuality)
  @IsOptional()
  quality?: ItemQuality;

  @IsNumber()
  @IsOptional()
  actionAmount?: number;
}
