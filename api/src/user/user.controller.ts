import { StatsUserDto } from './dto/stats.dto';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get('me')
  getMe(@GetUser() user: User) {
    delete user.updatedAt;
    delete user.createdAt;
    return user;
  }

  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }

  @Patch('points')
  addPoints(
    @GetUser('id') userId: number,
    @Body() dto: StatsUserDto,
  ) {
    return this.userService.addPoints(
      userId,
      dto,
    );
  }
}
