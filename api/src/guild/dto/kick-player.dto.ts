import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class KickGuildDto {
  @IsNumber()
  @IsNotEmpty()
  playerId?: number;
}
