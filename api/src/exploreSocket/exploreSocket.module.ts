import { BattleModule } from 'src/battle/battle.module';
import { ExploreModule } from '../explore/explore.module';
import { Module } from '@nestjs/common';
import { ExploreSocketGateway } from './exploreSocket.gateway';
import { ExploreSocketService } from './exploreSocket.service';

@Module({
  providers: [
    ExploreSocketGateway,
    ExploreSocketService,
  ],
  imports: [
    ExploreModule,
    ExploreModule,
    BattleModule,
  ],
  exports: [ExploreSocketGateway],
})
export class ExploreSocketModule {}
