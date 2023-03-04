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
import { GetUser } from '../auth/decorator';
import { Header } from 'src/auth/decorator/request-header';
import { JwtGuard } from '../auth/guard';
import { ItemService } from './item.service';
import {
  CreateItemDto,
  EditItemDto,
} from './dto';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('item')
export class ItemController {
  constructor(private ItemService: ItemService) {}

  @Get()
  getItems(@GetUser() user: User) {
    return this.ItemService.getItems(user);
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
    @GetUser() user: User,
    @Body() dto: CreateItemDto,
  ) {
    return this.ItemService.createItem(user, dto);
  }

  @Post('/equip/:id')
  equipItemById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) itemId: number,
  ) {
    return this.ItemService.equipItem(
      userId,
      itemId,
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

  @Post('delete-many')
  deleteManyItemsByIds(
    @GetUser('id') userId: number,
    @Body() values: { itemsIds: number[] },
  ) {
    return this.ItemService.deleteManyItemsByIds(
      userId,
      values.itemsIds,
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
