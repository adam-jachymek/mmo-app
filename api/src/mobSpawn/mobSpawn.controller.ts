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
import { JwtGuard } from '../auth/guard';
import { MobSpawnService } from './mobSpawn.service';
import {
  CreateMobSpawnDto,
  EditMobSpawnDto,
} from './dto';

@UseGuards(JwtGuard)
@Controller('mob_spawn')
export class MobSpawnController {
  constructor(
    private MobSpawnService: MobSpawnService,
  ) {}

  @Get()
  getMobSpawns() {
    return this.MobSpawnService.getMobSpawns();
  }

  @Get(':id')
  getMobSpawnById(
    @Param('id', ParseIntPipe) mobSpawnId: number,
  ) {
    return this.MobSpawnService.getMobSpawnById(
      mobSpawnId,
    );
  }

  @Post()
  createMobSpawn(@Body() dto: CreateMobSpawnDto) {
    return this.MobSpawnService.createMobSpawn(
      dto,
    );
  }

  @Patch(':id')
  editMobSpawnById(
    @Param('id', ParseIntPipe) MobSpawnId: number,
    @Body() dto: EditMobSpawnDto,
  ) {
    return this.MobSpawnService.editMobSpawnById(
      MobSpawnId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteMobSpawnById(
    @Param('id', ParseIntPipe) mobSpawnId: number,
  ) {
    return this.MobSpawnService.deleteMobSpawnById(
      mobSpawnId,
    );
  }
}
