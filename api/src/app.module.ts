import { DialogOptionModule } from './dialogOptions/dialogOptions.module';
import { DialogModule } from './dialog/dialog.module';
import { NpcModule } from './npc/npc.module';
import { ExploreSocketModule } from './exploreSocket/exploreSocket.module';
import { ActionItemDropModule } from './actionItemDrop/actionItemDrop.module';
import { MapSpritesModule } from './mapSprites/mapSprites.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ItemPrototypeModule } from './itemPrototype/itemPrototype.module';
import { ItemModule } from './item/item.module';
import { MobModule } from './mobs/mob.module';
import { MobSpawnModule } from './mobSpawn/mobSpawn.module';
import { MapModule } from './map/map.module';
import { PrismaModule } from './prisma/prisma.module';
import { BattleModule } from './battle/battle.module';
import { ExploreModule } from './explore/explore.module';
import { GuildModule } from './guild/guild.module';
import { MessagesModule } from './messages/messages.module';
import { BattleSocketModule } from './battleSocket/battleSocket.module';
import { MapTilesModule } from './mapTiles/mapTiles.module';
import { UserSocketModule } from './userSocket/userSocket.module';
import { ActionMobSpawnModule } from './actionMobSpawn/actionMobSpawn.module';

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
    MapModule,
    BattleModule,
    ExploreModule,
    GuildModule,
    MessagesModule,
    BattleSocketModule,
    MapTilesModule,
    UserSocketModule,
    MapSpritesModule,
    ActionMobSpawnModule,
    ActionItemDropModule,
    ExploreSocketModule,
    NpcModule,
    DialogModule,
    DialogOptionModule,
  ],
})
export class AppModule {}
