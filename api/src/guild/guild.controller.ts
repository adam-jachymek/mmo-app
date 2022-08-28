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
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { GuildService } from './guild.service';
import {
  CreateGuildDto,
  EditGuildDto,
} from './dto';
import { User } from '@prisma/client';

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
    @GetUser() user: User,
    @Param('id', ParseIntPipe) guildId: number,
  ) {
    return this.GuildService.getGuildById(
      user,
      guildId,
    );
  }

  @Post()
  createGuild(
    @GetUser() user: User,
    @Body() dto: CreateGuildDto,
  ) {
    return this.GuildService.createGuild(
      user,
      dto,
    );
  }

  @Patch(':id')
  editGuildById(
    @GetUser() user: User,
    @Body() dto: EditGuildDto,
    @Param('id', ParseIntPipe) guildId: number,
  ) {
    return this.GuildService.editGuild
    (
      guildId,
      user,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteGuildById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) guildId: number,
  ) {
    return this.GuildService.deleteGuildById(
      guildId,
      user,
    );
  }

  @Get(':id/request')
  userRequest(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) guildId: number,
  ) {
    return this.GuildService.createRequest(
      guildId,
      user,
    );
  }

  @Get(':guildId/users/:playerId/accept')
  acceptPlayer(
    @GetUser() user: User,
    @Param('guildId', ParseIntPipe) guildId: number,
    @Param('playerId', ParseIntPipe) playerId: number,
  ) {
    return this.GuildService.acceptGuildPlayer(
      guildId,
      playerId,
      user,
    );
  }

  @Get(':guildId/leave')
  leaveGuild(
    @GetUser() user: User,
    @Param('guildId', ParseIntPipe) guildId: number,
  ) {
    return this.GuildService.leaveGuild(guildId, user);
  }

  @Get(':guildId/users/:playerId/kick')
  kickGuildPlayer(
    @GetUser() user: User,
    @Param('guildId', ParseIntPipe) guildId: number,
    @Param('playerId', ParseIntPipe) playerId: number,
  ) {
    return this.GuildService.kickGuildPlayer(
      guildId,
      playerId,
      user
    );
  }
}
