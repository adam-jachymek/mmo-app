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
import { ActionItemDropService } from './actionItemDrop.service';

import { JwtGuard } from 'src/auth/guard';
import { ActionItemDropDto } from './dto/ActionItemDrop.dto';

@UseGuards(JwtGuard)
@Controller('action_item_drop')
export class ActionItemDropController {
  constructor(
    private ActionItemDropService: ActionItemDropService,
  ) {}

  @Get(':actionMobId')
  getActionDrop(
    @Param('actionMobId', ParseIntPipe)
    actionMobSpawnId: number,
  ) {
    return this.ActionItemDropService.getActionDrop(
      actionMobSpawnId,
    );
  }

  @Post(':actionMobSpawnId')
  createActionDrop(
    @Param('actionMobSpawnId', ParseIntPipe)
    actionMobSpawnId: number,
    @Body() dto: ActionItemDropDto,
  ) {
    return this.ActionItemDropService.createOrUpdateActionDrop(
      actionMobSpawnId,
      dto,
    );
  }

  @Patch(':actionMobSpawnId/:actionItemDropId')
  updateActionDrop(
    @Param('actionMobSpawnId', ParseIntPipe)
    actionMobSpawnId: number,
    @Param('actionItemDropId', ParseIntPipe)
    actionItemDropId: number,
    @Body() dto: ActionItemDropDto,
  ) {
    return this.ActionItemDropService.createOrUpdateActionDrop(
      actionMobSpawnId,
      dto,
      actionItemDropId,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':actionItemDropId')
  deleteMobSpawn(
    @Param('actionItemDropId', ParseIntPipe)
    actionItemDropId: number,
  ) {
    return this.ActionItemDropService.deleteActionDrop(
      actionItemDropId,
    );
  }
}
