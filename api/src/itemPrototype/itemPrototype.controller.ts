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
import { ItemPrototypeService } from './itemPrototype.service';
import {
  CreateItemDto,
  EditItemDto,
} from './dto';

@UseGuards(JwtGuard)
@Controller('item_prototype')
export class ItemPrototypeController {
  constructor(
    private ItemPrototypeService: ItemPrototypeService,
  ) {}

  @Get()
  getItems(@GetUser('id') userId: number) {
    return this.ItemPrototypeService.getItems(
      userId,
    );
  }

  @Get('admin')
  getItemsAdmin() {
    return this.ItemPrototypeService.getItemsAdmin();
  }

  @Get(':id')
  getItemsById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) itemId: number,
  ) {
    return this.ItemPrototypeService.getItemById(
      itemId,
    );
  }

  @Post()
  createItems(
    @GetUser('id') userId: number,
    @Body() dto: CreateItemDto,
  ) {
    return this.ItemPrototypeService.createItem(
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
    return this.ItemPrototypeService.editItemById(
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
    return this.ItemPrototypeService.deleteItemById(
      userId,
      itemId,
    );
  }
}
