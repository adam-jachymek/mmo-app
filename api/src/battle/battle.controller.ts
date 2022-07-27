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
    @Body() dto: CreateBattleDto,
  ) {
    return this.BattleService.createBattle(
      userId,
      dto,
    );
  }
}
