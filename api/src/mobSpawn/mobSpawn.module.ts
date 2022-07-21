import { Module } from '@nestjs/common';
import { MobSpawnController } from './mobSpawn.controller';
import { MobSpawnService } from './mobSpawn.service';

@Module({
  controllers: [MobSpawnController],
  providers: [MobSpawnService],
})
export class MobSpawnModule {}
