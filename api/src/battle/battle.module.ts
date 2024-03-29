import { ItemModule } from './../item/item.module';
import {
  forwardRef,
  Module,
} from '@nestjs/common';
import { MobSpawnModule } from 'src/mobSpawn/mobSpawn.module';
import { UserModule } from 'src/user/user.module';
import { BattleController } from './battle.controller';
import { BattleService } from './battle.service';

@Module({
  controllers: [BattleController],
  providers: [BattleService],
  imports: [
    UserModule,
    MobSpawnModule,
    ItemModule,
  ],
  exports: [BattleService],
})
export class BattleModule {}
