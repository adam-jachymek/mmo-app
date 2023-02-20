import { Module } from '@nestjs/common';
import { ActionMobSpawnController } from './actionMobSpawn.controller';
import { ActionMobSpawnService } from './actionMobSpawn.service';

@Module({
  controllers: [ActionMobSpawnController],
  providers: [ActionMobSpawnService],
  exports: [ActionMobSpawnService],
})
export class ActionMobSpawnModule {}
