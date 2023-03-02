import { npcUpload } from './../config/npcUpload.config';
import { NpcDto } from './dto/npc.dto';
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { NpcService } from './npc.service';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtGuard)
@Controller('npc')
export class NpcController {
  prisma: any;
  constructor(private npcService: NpcService) {}

  @Get()
  getAllNpcs() {
    return this.npcService.getAllNpcs();
  }

  @Get(':id')
  getNpcById(
    @Param('id', ParseIntPipe) npcId: number,
  ) {
    return this.npcService.getOneNpc(npcId);
  }

  @UseInterceptors(
    FileInterceptor('file', npcUpload),
  )
  @Post()
  createNpc(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: NpcDto,
  ) {
    return this.npcService.createNpc(dto, file);
  }

  @Patch(':id')
  editItemById(
    @Param('id', ParseIntPipe) npcId: number,
    @Body() dto: NpcDto,
  ) {
    return this.npcService.editNpcById(
      npcId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteItemById(
    @Param('id', ParseIntPipe) npcId: number,
  ) {
    return this.npcService.deleteNpcById(npcId);
  }
}
