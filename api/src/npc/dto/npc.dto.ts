import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class NpcDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
