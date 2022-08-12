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
import { GuildService } from './guild.service';
import {
  CreateGuildDto,
  EditGuildDto,
  PlayerIdDto,
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

  @Post('/request/:id')
  userRequest(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) guildId: number,
  ) {
    return this.GuildService.userRequest(
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

  @Post('accept')
  acceptGuildPlayer(
    @GetUser() user: User,
    @Body() dto: PlayerIdDto,
  ) {
    return this.GuildService.acceptGuildPlayer(
      user,
      dto,
    );
  }

  @Post('leave')
  leaveGuild(@GetUser() user: User) {
    return this.GuildService.leaveGuild(user);
  }

  @Post('kick')
  kickGuildPlayer(
    @GetUser() user: User,
    @Body() dto: PlayerIdDto,
  ) {
    return this.GuildService.kickGuildPlayer(
      user,
      dto,
    );
  }

  @Patch()
  editGuildById(
    @GetUser() user: User,
    @Body() dto: EditGuildDto,
  ) {
    return this.GuildService.editGuildById(
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
      user,
    );
  }
}
