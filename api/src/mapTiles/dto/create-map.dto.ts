import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateMapDto {
  @IsNumber()
  @IsNotEmpty()
  mapId: number;
}
