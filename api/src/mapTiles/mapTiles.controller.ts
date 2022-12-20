import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { Header } from 'src/auth/decorator/request-header';
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

  @Get()
  getMap() {
    return this.MapTilesService.getMap();
  }

  @Get('admin')
  getMapAdmin() {
    return this.MapTilesService.getMapAdmin();
  }

  @Get(':id')
  getMapById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) mapId: number,
  ) {
    return this.MapTilesService.getMapById(mapId);
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteItemById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) mapId: number,
  ) {
    return this.MapTilesService.deleteMapById(
      userId,
      mapId,
    );
  }
}
