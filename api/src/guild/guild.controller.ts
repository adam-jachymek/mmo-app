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
import { Header } from 'src/auth/decorator/request-header';
import { JwtGuard } from '../auth/guard';
import { GuildService } from './guild.service';
import {
  CreateGuildDto,
  EditGuildDto,
} from './dto';

@UseGuards(JwtGuard)
@Controller('guild')
export class GuildController {
  constructor(
    private GuildService: GuildService,
  ) {}

  @Get()
  getGuilds() {
    return this.GuildService.getGuilds();
  }

  @Get(':id')
  getGuildById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) GuildId: number,
  ) {
    return this.GuildService.getGuildById(
      GuildId,
    );
  }

  @Post()
  createGuild(
    @GetUser('id') userId: number,
    @Body() dto: CreateGuildDto,
  ) {
    return this.GuildService.createGuild(
      userId,
      dto,
    );
  }

  @Patch(':id')
  editGuildById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) guildId: number,
    @Body() dto: EditGuildDto,
  ) {
    return this.GuildService.editGuildById(
      userId,
      guildId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteItemById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) guildId: number,
  ) {
    return this.GuildService.deleteGuildById(
      userId,
      guildId,
    );
  }
}
