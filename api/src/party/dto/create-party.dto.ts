import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePartyDto {
  @IsNumber()
  @IsNotEmpty()
  mobId: number;
}
