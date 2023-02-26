import { UserModule } from 'src/user/user.module';
import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
  imports: [UserModule],
})
export class ItemModule {}
