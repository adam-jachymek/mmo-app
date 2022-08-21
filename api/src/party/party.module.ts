import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';

@Module({
  controllers: [PartyController],
  providers: [PartyService],
  imports: [UserModule],
  exports: [PartyService],
})
export class PartyModule {}
