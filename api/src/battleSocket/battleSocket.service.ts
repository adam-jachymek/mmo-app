import { Injectable } from '@nestjs/common';
import { CreateBattleSocket } from './dto/create-battleSocket.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { BattleSocket } from './entities/battleSocket.entity';

@Injectable()
export class BattleSocketService {
  clientToUser = {};

  join(name: string, clientId: string) {
    this.clientToUser[clientId] = name;

    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  create(createMessageDto: CreateBattleSocket) {
    // this.messages.push(createMessageDto);

    return createMessageDto;
  }

  findAll() {
    // return this.messages;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(
    id: number,
    updateMessageDto: UpdateMessageDto,
  ) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
