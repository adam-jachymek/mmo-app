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
import { ItemService } from './item.service';
import {
  CreateItemDto,
  EditItemDto,
} from './dto';

@UseGuards(JwtGuard)
@Controller('item')
export class ItemController {
  constructor(private ItemService: ItemService) {}

  @Get()
  getItems(@GetUser('id') userId: number) {
    return this.ItemService.getItems(userId);
  }

  @Get('admin')
  getItemsAdmin() {
    return this.ItemService.getItemsAdmin();
  }

  @Get(':id')
  getItemsById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) itemId: number,
  ) {
    return this.ItemService.getItemById(itemId);
  }

  @Post()
  createItems(
    @GetUser('id') level: number,
    @GetUser('id') userId: number,
    @Body() dto: CreateItemDto,
  ) {
    return this.ItemService.createItem(
      level,
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
    return this.ItemService.editItemById(
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
    return this.ItemService.deleteItemById(
      userId,
      itemId,
    );
  }
}
