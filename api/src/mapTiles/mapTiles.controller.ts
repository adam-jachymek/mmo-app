import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { MapTilesService } from './mapTiles.service';
import { CreateMapDto, EditTileDto } from './dto';

@UseGuards(JwtGuard)
@Controller('map_tiles')
export class MapTilesController {
  constructor(
    private MapTilesService: MapTilesService,
  ) {}

  @Post()
  createMapTiles(@Body() dto: CreateMapDto) {
    return this.MapTilesService.createMapTiles(
      dto,
    );
  }

  @Patch(':id')
  editTile(
    @Param('id', ParseIntPipe) tileId: number,
    @Body() dto: EditTileDto,
  ) {
    return this.MapTilesService.editTile(
      tileId,
      dto,
    );
  }

  @Post('many')
  updateManyTiles(
    @Body()
    data: {
      ids: number[];
      values: EditTileDto;
    },
  ) {
    return this.MapTilesService.updateManyTiles(
      data,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteItemById(
    @Param('id', ParseIntPipe) tileId: number,
  ) {
    return this.MapTilesService.deleteMapById(
      tileId,
    );
  }
}
