import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsNumber()
  @IsOptional()
  stamina?: number;

  @IsNumber()
  @IsOptional()
  strength?: number;

  @IsNumber()
  @IsOptional()
  defence?: number;

  @IsNumber()
  @IsOptional()
  speed?: number;

  @IsNumber()
  @IsOptional()
  intelligence?: number;
}
