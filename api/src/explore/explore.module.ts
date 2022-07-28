import { Module } from '@nestjs/common';
import { ExploreController } from './explore.controller';
import { ExploreService } from './explore.service';
import { MobSpawnModule } from 'src/mobSpawn/mobSpawn.module';
import { MapModule } from 'src/map/map.module';

@Module({
  controllers: [ExploreController],
  providers: [ExploreService],
  imports: [MobSpawnModule, MapModule],
})
export class ExploreModule {}
