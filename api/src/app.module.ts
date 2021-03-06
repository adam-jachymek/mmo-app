import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ItemPrototypeModule } from './itemPrototype/itemPrototype.module';
import { ItemModule } from './item/item.module';
import { MobModule } from './mobs/mob.module';
import { MobSpawnModule } from './mobSpawn/mobSpawn.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ItemPrototypeModule,
    ItemModule,
    MobModule,
    MobSpawnModule,
    PrismaModule,
  ],
})
export class AppModule {}
