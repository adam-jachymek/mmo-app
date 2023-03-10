import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class DialogOptionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNumber()
  @IsNotEmpty()
  dialogId: number;

  @IsNumber()
  @IsOptional()
  nextDialogId: number;
}
