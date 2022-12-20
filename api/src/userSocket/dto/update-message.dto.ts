import { PartialType } from '@nestjs/mapped-types';
import { CreateBattleSocket } from './create-battleSocket.dto';

export class UpdateMessageDto extends PartialType(
  CreateBattleSocket,
) {
  id: number;
}
