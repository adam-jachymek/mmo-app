import { PartialType } from '@nestjs/mapped-types';
import { CreateBattleSocket } from './create-exploreSocket.dto';

export class UpdateMessageDto extends PartialType(
  CreateBattleSocket,
) {
  id: number;
}
