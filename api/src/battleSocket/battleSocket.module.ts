import { UserSocketModule } from './../userSocket/userSocket.module';
import { Module } from '@nestjs/common';
import { BattleSocketService } from './battleSocket.service';
import { BattleSocketGateway } from './battleSocket.gateway';
import { BattleModule } from 'src/battle/battle.module';

@Module({
  providers: [
    BattleSocketGateway,
    BattleSocketService,
  ],
  imports: [BattleModule, UserSocketModule],
  exports: [BattleSocketGateway],
})
export class BattleSocketModule {}
