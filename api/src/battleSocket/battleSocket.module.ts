import { ExploreSocketModule } from './../exploreSocket/exploreSocket.module';
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
  imports: [
    BattleModule,
    UserSocketModule,
    ExploreSocketModule,
  ],
  exports: [BattleSocketGateway],
})
export class BattleSocketModule {}
