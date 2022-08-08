import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { GuildController } from './guild.controller';
import { GuildService } from './guild.service';

@Module({
  controllers: [GuildController],
  providers: [GuildService],
  exports: [GuildService],
  imports: [UserService],
})
export class GuildModule {}
