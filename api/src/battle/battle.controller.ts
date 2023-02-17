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
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { MobSpawnService } from 'src/mobSpawn/mobSpawn.service';
import { Server, Socket } from 'socket.io';

import { BattleService } from './battle.service';
import {
  CreateBattleDto,
  EditBattleDto,
} from './dto';

@UseGuards(JwtGuard)
@Controller('battle')
export class BattleController {
  constructor(
    private BattleService: BattleService,
  ) {}

  @Post()
  createBattle(
    @GetUser('id') userId: number,
    @Body()
    values: {
      mobId: number;
      mobMinLevel: number;
      mobMaxLevel: number;
    },
  ) {
    return this.BattleService.createBattle(
      userId,
      values,
    );
  }

  // @Post(':id')
  // battleTurn(
  //   @GetUser() user: User,
  //   @Param('id', ParseIntPipe) battleId: number,
  // ) {
  //   return this.BattleService.turn(
  //     user,
  //     battleId,
  //   );
  // }

  @Get(':id')
  getBattleById(
    @Param('id', ParseIntPipe) battleId: number,
  ) {
    return this.BattleService.getBattleById(
      battleId,
    );
  }
}
