import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class DialogDto {
  @IsArray()
  @IsOptional()
  text: string[];

  @IsNumber()
  @IsOptional()
  nextId: number;

  @IsNumber()
  @IsOptional()
  npcId: number;
}
