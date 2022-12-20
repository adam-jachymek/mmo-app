import { Module } from '@nestjs/common';
import { UserSocketService } from './userSocket.service';
import { UserSocketGateway } from './userSocket.gateway';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [
    UserSocketGateway,
    UserSocketService,
  ],
  imports: [UserModule],
})
export class UserSocketModule {}
