import { Module } from '@nestjs/common';
import { PartySocketService } from './partySocket.service';
// import { PartySocketGateway } from './partySocket.gateway';
import { PartyModule } from 'src/party/party.module';

@Module({
  providers: [
    // PartySocketGateway,
    PartySocketService,
  ],
  imports: [PartyModule],
})
export class PartySocketModule {}
