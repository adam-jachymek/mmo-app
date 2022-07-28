import { Module } from '@nestjs/common';
import { MobSpawnController } from './mobSpawn.controller';
import { MobSpawnService } from './mobSpawn.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [MobSpawnController],
  providers: [MobSpawnService],
  imports: [UserModule],
  exports: [MobSpawnService],
})
export class MobSpawnModule {}
