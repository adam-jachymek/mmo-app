// import {
//   WebSocketGateway,
//   SubscribeMessage,
//   MessageBody,
//   WebSocketServer,
//   ConnectedSocket,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { BattleService } from 'src/battle/battle.service';
// import { PartyService } from 'src/party/party.service';

// @WebSocketGateway({ cors: true })
// export class PartySocketGateway {
//   @WebSocketServer()
//   server: Server;

//   constructor(
//     private readonly partyService: PartyService,
//   ) {}

//   @SubscribeMessage('joinParty')
//   async joinParty(
//     socket: Socket,
//     partyId: string,
//   ) {
//     socket.join(`party-${partyId}`);

//     this.server
//       .to(`party-${partyId}`)
//       .emit(
//         `party-${partyId}`,
//         `You joined to the party: ${partyId}, user: ${socket.id}`,
//       );

//     this.sendUpdate(partyId);
//   }

//   async delay(ms: number) {
//     return new Promise((resolve) =>
//       setTimeout(resolve, ms),
//     );
//   }

//   async sendUpdate(partyId: string) {
//     const partySocket = `party-${partyId}`;

//     const party =
//       await this.partyService.returnParty(
//         Number(partyId),
//       );

//     this.server
//       .to(partySocket)
//       .emit(partySocket, party);
//   }
// }
