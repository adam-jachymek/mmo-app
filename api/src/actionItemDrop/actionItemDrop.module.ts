import { Module } from '@nestjs/common';
import { ActionItemDropController } from './actionItemDrop.controller';
import { ActionItemDropService } from './actionItemDrop.service';

@Module({
  controllers: [ActionItemDropController],
  providers: [ActionItemDropService],
  exports: [ActionItemDropService],
})
export class ActionItemDropModule {}
