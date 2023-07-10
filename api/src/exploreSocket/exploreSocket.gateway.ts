import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({ cors: true })
export class ExploreSocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  usersIds = [];

  @SubscribeMessage('connectExplore')
  async connectUser(
    socket: Socket,
    data: { mapId: number; userId: number },
  ) {
    socket.join(`map-${data.mapId}`);

    if (!this.usersIds.includes(data.userId)) {
      this.usersIds.push(data.userId);
    }

    this.updatePlayers(data.mapId);
  }

  @SubscribeMessage('exploreMove')
  async updatePlayers(
    @MessageBody('mapId') mapId: number,
    @MessageBody('userId') userId?: number,
  ) {
    const users = await this.prisma.user.findMany(
      {
        where: {
          id: {
            in: this.usersIds,
            not: { equals: userId },
          },
        },
      },
    );

    const returnUsers = users.map((user) => ({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      level: user.level,
      hp: user.hp,
      maxHp: user.maxHp,
      battleId: user.battleId,
      x: user.x,
      y: user.y,
    }));

    this.server
      .to(`map-${mapId}`)
      .emit(`map-${mapId}`, returnUsers);
  }
}
