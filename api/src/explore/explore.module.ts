import { UserSocketModule } from './../userSocket/userSocket.module';
import { Module } from '@nestjs/common';
import { ExploreController } from './explore.controller';
import { ExploreService } from './explore.service';
import { BattleModule } from 'src/battle/battle.module';

@Module({
  controllers: [ExploreController],
  providers: [ExploreService],
  imports: [BattleModule, BattleModule],
  exports: [ExploreService],
})
export class ExploreModule {}
