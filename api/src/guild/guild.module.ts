import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { GuildController } from './guild.controller';
import { GuildService } from './guild.service';
import {GuildModel} from "./guild.model";

@Module({
  controllers: [GuildController],
  providers: [GuildService, GuildModel],
  exports: [GuildService],
  imports: [UserService],
})
export class GuildModule {}
