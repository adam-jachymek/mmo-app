import { Module } from '@nestjs/common';
import { MobSpawnModule } from 'src/mobSpawn/mobSpawn.module';
import { MobSpawnService } from 'src/mobSpawn/mobSpawn.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { BattleController } from './battle.controller';
import { BattleService } from './battle.service';

@Module({
  controllers: [BattleController],
  providers: [BattleService],
  imports: [MobSpawnModule, UserModule],
})
export class BattleModule {}
