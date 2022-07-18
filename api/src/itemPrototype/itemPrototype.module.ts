import { Module } from '@nestjs/common';
import { ItemPrototypeController } from './itemPrototype.controller';
import { ItemPrototypeService } from './itemPrototype.service';

@Module({
  controllers: [ItemPrototypeController],
  providers: [ItemPrototypeService],
})
export class ItemPrototypeModule {}
