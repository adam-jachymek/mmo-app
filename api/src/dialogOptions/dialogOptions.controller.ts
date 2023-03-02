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
import { DialogOptionService } from './dialogOptions.service';
import { DialogOptionDto } from './dto/dialogOptions.dto';

@UseGuards(JwtGuard)
@Controller('dialog-option')
export class DialogOptionController {
  constructor(
    private dialogOptionService: DialogOptionService,
  ) {}

  @Get()
  getAllDialogOptions() {
    return this.dialogOptionService.getAllDialogOptions();
  }

  @Get(':id')
  getDialogOptionById(
    @Param('id', ParseIntPipe)
    dialogOptionId: number,
  ) {
    return this.dialogOptionService.getOneDialogOption(
      dialogOptionId,
    );
  }

  @Get('dialog/:id')
  getDialogOptionsByDialogId(
    @Param('id', ParseIntPipe)
    dialogId: number,
  ) {
    return this.dialogOptionService.getDialogOptionsByDialogId(
      dialogId,
    );
  }

  @Post()
  createDialogOption(
    @Body() dto: DialogOptionDto,
  ) {
    return this.dialogOptionService.createDialogOption(
      dto,
    );
  }

  @Patch(':id')
  editItemById(
    @Param('id', ParseIntPipe)
    dialogOptionId: number,
    @Body() dto: DialogOptionDto,
  ) {
    return this.dialogOptionService.editDialogOptionById(
      dialogOptionId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteItemById(
    @Param('id', ParseIntPipe)
    dialogOptionId: number,
  ) {
    return this.dialogOptionService.deleteOptionById(
      dialogOptionId,
    );
  }
}
