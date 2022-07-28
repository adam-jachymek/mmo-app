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
import { ExploreService } from './explore.service';
import {
  CreateExploreDto,
  EditExploreDto,
} from './dto';

@UseGuards(JwtGuard)
@Controller('explore')
export class ExploreController {
  constructor(
    private ExploreService: ExploreService,
  ) {}

  @Get(':id')
  getExplore(
    @Param('id', ParseIntPipe) mapId: number,
  ) {
    return this.ExploreService.getExplore(mapId);
  }
}
