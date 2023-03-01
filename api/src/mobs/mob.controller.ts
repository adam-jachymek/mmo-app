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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { MobService } from './mob.service';
import { CreateMobDto, EditMobDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { mobUpload } from 'src/config/mobUpload.config';

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

  @UseInterceptors(
    FileInterceptor('sprite', mobUpload),
  )
  @Post('sprite/:id')
  createSprite(
    @Param('id', ParseIntPipe) mobId: number,
    @UploadedFile() sprite: Express.Multer.File,
  ) {
    return this.MobService.createSprite(
      mobId,
      sprite,
    );
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
