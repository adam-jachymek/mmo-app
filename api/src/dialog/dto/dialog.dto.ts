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
  @IsNotEmpty()
  text: string[];

  @IsNumber()
  @IsOptional()
  npcId: number;
}
