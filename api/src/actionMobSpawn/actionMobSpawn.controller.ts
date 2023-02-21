import { ActionMobSpawnService } from './actionMobSpawn.service';
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
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from 'src/auth/guard';
import { ActionMobSpawnDto } from './dto/ActionMobSpawn';

@UseGuards(JwtGuard)
@Controller('action_mob_spawn')
export class ActionMobSpawnController {
  constructor(
    private ActionMobSpawnService: ActionMobSpawnService,
  ) {}

  @Get('/many')
  getManyMobSpawns(
    @Query('query') query: string[],
  ) {
    return this.ActionMobSpawnService.getManyMobSpawns(
      query,
    );
  }

  @Get(':tileId')
  getMobSpawns(
    @Param('tileId', ParseIntPipe) tileId: number,
  ) {
    return this.ActionMobSpawnService.getMobSpawns(
      tileId,
    );
  }

  @Post(':tileId')
  createMobSpawn(
    @Param('tileId', ParseIntPipe) tileId: number,
    @Body() dto: ActionMobSpawnDto,
  ) {
    return this.ActionMobSpawnService.createOrUpdateMobSpawn(
      tileId,
      dto,
    );
  }

  @Patch(':tileId/:actionMobSpawnId')
  updateMobSpawn(
    @Param('tileId', ParseIntPipe) tileId: number,
    @Param('actionMobSpawnId', ParseIntPipe)
    actionMobSpawnId: number,
    @Body() dto: ActionMobSpawnDto,
  ) {
    return this.ActionMobSpawnService.createOrUpdateMobSpawn(
      tileId,
      dto,
      actionMobSpawnId,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':actionMobSpawnId')
  deleteMobSpawn(
    @Param('actionMobSpawnId', ParseIntPipe)
    actionMobSpawnId: number,
  ) {
    return this.ActionMobSpawnService.deleteMobSpawn(
      actionMobSpawnId,
    );
  }
}
