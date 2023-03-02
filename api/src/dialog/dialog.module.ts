import { Module } from '@nestjs/common';
import { DialogController } from './dialog.controller';
import { DialogService } from './dialog.service';

@Module({
  controllers: [DialogController],
  providers: [DialogService],
  exports: [DialogService],
})
export class DialogModule {}
