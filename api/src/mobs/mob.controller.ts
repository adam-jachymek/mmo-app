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
import { MobService } from './mob.service';
import { CreateMobDto, EditMobDto } from './dto';

@UseGuards(JwtGuard)
@Controller('mobs')
export class MobController {
  constructor(private MobService: MobService) {}

  @Get()
  getMobs() {
    return this.MobService.getMobs();
  }

  @Get(':id')
  getMobById(
    @Param('id', ParseIntPipe) mobId: number,
  ) {
    return this.MobService.getMobById(mobId);
  }

  @Post()
  createMob(@Body() dto: CreateMobDto) {
    return this.MobService.createMob(dto);
  }

  @Patch(':id')
  editMobById(
    @Param('id', ParseIntPipe) MobId: number,
    @Body() dto: EditMobDto,
  ) {
    return this.MobService.editMobById(
      MobId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteMobById(
    @Param('id', ParseIntPipe) mobId: number,
  ) {
    return this.MobService.deleteMobById(mobId);
  }
}
