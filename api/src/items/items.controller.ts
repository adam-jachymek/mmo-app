import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { Header } from 'src/auth/decorator/request-header';
import { JwtGuard } from '../auth/guard';
import { ItemsService } from './items.service';
import {
  CreateItemDto,
  EditItemDto,
} from './dto';

@UseGuards(JwtGuard)
@Controller('items')
export class ItemsController {
  constructor(
    private itemsService: ItemsService,
  ) {}

  @Get()
  getItems(@GetUser('id') userId: number) {
    return this.itemsService.getItems(userId);
  }

  @Get(':id')
  getItemsById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) itemId: number,
  ) {
    return this.itemsService.getItemById(itemId);
  }

  @Post()
  createItems(
    @GetUser('id') userId: number,
    @Body() dto: CreateItemDto,
  ) {
    return this.itemsService.createItem(
      userId,
      dto,
    );
  }

  @Patch(':id')
  editItemById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) itemId: number,
    @Body() dto: EditItemDto,
  ) {
    return this.itemsService.editItemById(
      userId,
      itemId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteItemById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) itemId: number,
  ) {
    return this.itemsService.deleteItemById(
      userId,
      itemId,
    );
  }
}
