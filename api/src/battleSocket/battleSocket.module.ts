import { Module } from '@nestjs/common';
import { BattleSocketService } from './battleSocket.service';
import { BattleSocketGateway } from './battleSocket.gateway';
import { BattleModule } from 'src/battle/battle.module';

@Module({
  providers: [
    BattleSocketGateway,
    BattleSocketService,
  ],
  imports: [BattleModule],
})
export class BattleSocketModule {}
