import { ExploreSocketModule } from './../exploreSocket/exploreSocket.module';
import { BattleModule } from 'src/battle/battle.module';
import { ExploreModule } from './../explore/explore.module';
import {
  forwardRef,
  Module,
} from '@nestjs/common';
import { UserSocketService } from './userSocket.service';
import { UserSocketGateway } from './userSocket.gateway';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [
    UserSocketGateway,
    UserSocketService,
  ],
  imports: [
    UserModule,
    ExploreModule,
    BattleModule,
    ExploreSocketModule,
  ],
  exports: [UserSocketGateway],
})
export class UserSocketModule {}
