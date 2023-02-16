import { MapSpritesService } from './mapSprites.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multerOptions.config';

@UseGuards(JwtGuard)
@Controller('map_sprites')
export class MapSpritesController {
  constructor(
    private MapSpritesService: MapSpritesService,
  ) {}

  @Get()
  getAllSprites() {
    return this.MapSpritesService.getAllSprites();
  }

  @Get('/categories')
  getAllCategoies() {
    return this.MapSpritesService.getCategories();
  }

  @UseInterceptors(
    FileInterceptor('file', multerOptions),
  )
  @Post()
  createSprite(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    values: { name: string; category: string },
  ) {
    return this.MapSpritesService.createSprite(
      values,
      file,
    );
  }

  @Patch(':id')
  editSpriteById(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    values: {
      name?: string;
      category?: string;
      sprite?: string;
    },
  ) {
    return this.MapSpritesService.editSprite(
      id,
      values,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteMobById(
    @Param('id', ParseIntPipe) spriteId: number,
  ) {
    return this.MapSpritesService.deleteSpriteById(
      spriteId,
    );
  }
}
