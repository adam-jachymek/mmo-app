import { Module } from '@nestjs/common';
import { MapTilesController } from './mapTiles.controller';
import { MapTilesService } from './mapTiles.service';

@Module({
  controllers: [MapTilesController],
  providers: [MapTilesService],
  exports: [MapTilesService],
})
export class MapTilesModule {}
