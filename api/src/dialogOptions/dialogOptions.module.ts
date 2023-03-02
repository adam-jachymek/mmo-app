import { Module } from '@nestjs/common';
import { DialogOptionController } from './dialogOptions.controller';
import { DialogOptionService } from './dialogOptions.service';

@Module({
  controllers: [DialogOptionController],
  providers: [DialogOptionService],
  exports: [DialogOptionService],
})
export class DialogOptionModule {}
