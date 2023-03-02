import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DialogOptionDto } from './dto/dialogOptions.dto';

@Injectable()
export class DialogOptionService {
  constructor(private prisma: PrismaService) {}

  getAllDialogOptions() {
    return this.prisma.dialogOption.findMany();
  }

  getOneDialogOption(dialogOptionId: number) {
    return this.prisma.dialogOption.findUnique({
      where: {
        id: dialogOptionId,
      },
    });
  }

  getDialogOptionsByDialogId(dialogId: number) {
    return this.prisma.dialogOption.findMany({
      where: {
        dialogId: dialogId,
      },
    });
  }

  async createDialogOption(dto: DialogOptionDto) {
    return await this.prisma.dialogOption.create({
      data: {
        ...dto,
      },
    });
  }

  async editDialogOptionById(
    dialogOptionId: number,
    dto: DialogOptionDto,
  ) {
    return this.prisma.dialogOption.update({
      where: {
        id: dialogOptionId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteOptionById(DialogOptionId: number) {
    await this.prisma.map.delete({
      where: {
        id: DialogOptionId,
      },
    });
  }
}
