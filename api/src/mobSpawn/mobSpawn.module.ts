import { Module } from '@nestjs/common';
import { MobSpawnController } from './mobSpawn.controller';
import { MobSpawnService } from './mobSpawn.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [MobSpawnController],
  providers: [MobSpawnService],
  exports: [MobSpawnService],
})
export class MobSpawnModule {}
