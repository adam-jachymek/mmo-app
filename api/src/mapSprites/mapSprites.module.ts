import { MapSpritesService } from './mapSprites.service';
import { MapSpritesController } from './mapSprites.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [MapSpritesController],
  providers: [MapSpritesService],
  exports: [MapSpritesService],
})
export class MapSpritesModule {}
