import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBattleDto {
  @IsNumber()
  @IsNotEmpty()
  mobId: number;
}
