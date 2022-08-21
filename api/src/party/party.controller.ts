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
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

import { PartyService } from './party.service';
import {
  CreatePartyDto,
  EditPartyDto,
} from './dto';

@UseGuards(JwtGuard)
@Controller('party')
export class PartyController {
  constructor(
    private PartyService: PartyService,
  ) {}

  @Post()
  createParty(@GetUser('id') userId: number) {
    return this.PartyService.createParty(userId);
  }
}
