import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateGuildDto {
  @IsNumber()
  @IsNotEmpty()
  guildId: string;
}
