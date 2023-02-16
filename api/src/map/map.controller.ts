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
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { MapService } from './map.service';
import { CreateMapDto, EditMapDto } from './dto';

@UseGuards(JwtGuard)
@Controller('map')
export class MapController {
  constructor(private MapService: MapService) {}

  @Get()
  getMap() {
    return this.MapService.getMap();
  }

  @Get('admin')
  getMapAdmin() {
    return this.MapService.getMapAdmin();
  }

  @Get(':id')
  getMapById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) mapId: number,
  ) {
    return this.MapService.getMapById(mapId);
  }

  @Post()
  createMap(@Body() dto: CreateMapDto) {
    return this.MapService.createMap(dto);
  }

  @Patch(':id')
  editItemById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) mapId: number,
    @Body() dto: EditMapDto,
  ) {
    return this.MapService.editMapById(
      userId,
      mapId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteItemById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) mapId: number,
  ) {
    return this.MapService.deleteMapById(
      userId,
      mapId,
    );
  }
}
