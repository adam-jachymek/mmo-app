import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class DialogDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsBoolean()
  @IsOptional()
  isStart: boolean;

  @IsBoolean()
  @IsOptional()
  isEnd: boolean;

  @IsNumber()
  @IsOptional()
  npcId: number;
}
