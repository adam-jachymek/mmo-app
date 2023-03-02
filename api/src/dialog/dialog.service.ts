import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DialogDto } from './dto/dialog.dto';

@Injectable()
export class DialogService {
  constructor(private prisma: PrismaService) {}

  getAllDialogs() {
    return this.prisma.dialog.findMany({
      include: {
        options: true,
      },
    });
  }

  getOneDialog(dialogId: number) {
    return this.prisma.dialog.findUnique({
      where: {
        id: dialogId,
      },
      include: {
        options: true,
      },
    });
  }

  async createDialog(dto: DialogDto) {
    return await this.prisma.dialog.create({
      data: {
        ...dto,
      },
    });
  }

  async editDialogById(
    dialogId: number,
    dto: DialogDto,
  ) {
    return this.prisma.dialog.update({
      where: {
        id: dialogId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteDialogById(DialogId: number) {
    await this.prisma.map.delete({
      where: {
        id: DialogId,
      },
    });
  }
}
