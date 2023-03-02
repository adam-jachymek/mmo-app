import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { DialogService } from './dialog.service';
import { DialogDto } from './dto/dialog.dto';

@UseGuards(JwtGuard)
@Controller('dialog')
export class DialogController {
  constructor(
    private dialogService: DialogService,
  ) {}

  @Get()
  getAllDialogs() {
    return this.dialogService.getAllDialogs();
  }

  @Get(':id')
  getDialogById(
    @Param('id', ParseIntPipe) dialogId: number,
  ) {
    return this.dialogService.getOneDialog(
      dialogId,
    );
  }

  @Post()
  createDialog(@Body() dto: DialogDto) {
    return this.dialogService.createDialog(dto);
  }

  @Patch(':id')
  editItemById(
    @Param('id', ParseIntPipe) dialogId: number,
    @Body() dto: DialogDto,
  ) {
    return this.dialogService.editDialogById(
      dialogId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteItemById(
    @Param('id', ParseIntPipe) dialogId: number,
  ) {
    return this.dialogService.deleteDialogById(
      dialogId,
    );
  }
}
