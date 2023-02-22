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
    @Query('query') tilesIdsQuery: string[],
  ) {
    return this.ActionMobSpawnService.getManyActionMobSpawns(
      tilesIdsQuery,
    );
  }

  @Get(':tileId')
  getMobSpawns(
    @Param('tileId', ParseIntPipe) tileId: number,
  ) {
    return this.ActionMobSpawnService.getActionMobSpawns(
      tileId,
    );
  }

  @Post()
  createMobSpawn(
    @Query('query') tilesIdsQuery: string[],
    @Body() dto: ActionMobSpawnDto,
  ) {
    return this.ActionMobSpawnService.createActionMobSpawn(
      tilesIdsQuery,
      dto,
    );
  }

  @Patch('addtiles/:actionMobSpawnId')
  addTilesToMobSpawn(
    @Param('actionMobSpawnId', ParseIntPipe)
    actionMobSpawnId: number,
    @Query('query') tilesIdsQuery: string[],
  ) {
    return this.ActionMobSpawnService.addTilesToActionMobSpawn(
      actionMobSpawnId,
      tilesIdsQuery,
    );
  }

  @Patch('deletetiles/:actionMobSpawnId')
  deleteTilesFromMobSpawn(
    @Param('actionMobSpawnId', ParseIntPipe)
    actionMobSpawnId: number,
    @Query('query') tilesIdsQuery: string[],
  ) {
    return this.ActionMobSpawnService.deleteTilesFromActionMobSpawn(
      actionMobSpawnId,
      tilesIdsQuery,
    );
  }

  @Patch(':actionMobSpawnId')
  updateMobSpawn(
    @Param('actionMobSpawnId', ParseIntPipe)
    actionMobSpawnId: number,
    @Query('query') tilesIdsQuery: string[],
    @Body() dto: ActionMobSpawnDto,
  ) {
    return this.ActionMobSpawnService.updateActionMobSpawn(
      actionMobSpawnId,
      tilesIdsQuery,
      dto,
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
