import {
  Body,
  Controller,
  Delete,
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
import { CreateMapDto, EditMapDto } from './dto';

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
  editTileById(
    @Param('id', ParseIntPipe) tileId: number,
    @Body() dto: EditMapDto,
  ) {
    return this.MapTilesService.editTileById(
      tileId,
      dto,
    );
  }

  @Post('many')
  updateMany(
    @Body()
    data: {
      ids: number[];
      values: EditMapDto;
    },
  ) {
    return this.MapTilesService.updateMany(data);
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
