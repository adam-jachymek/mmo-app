import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class PlayerIdDto {
  @IsNumber()
  @IsNotEmpty()
  playerId: number;
}
