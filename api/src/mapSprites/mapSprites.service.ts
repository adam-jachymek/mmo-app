import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import multer from 'multer';

@Injectable()
export class MapSpritesService {
  constructor(private prisma: PrismaService) {}

  getAllSprites() {
    return this.prisma.mapSprites.findMany({});
  }

  getCategories() {
    return this.prisma.mapSprites.groupBy({
      by: ['category'],
    });
  }

  async createSprite(
    values: {
      name: string;
      category: string;
    },
    file: Express.Multer.File,
  ) {
    return await this.prisma.mapSprites.create({
      data: {
        name: values.name,
        category: values.category,
        sprite: file.path,
      },
    });
  }

  async editSprite(
    id: number,
    values: {
      name?: string;
      category?: string;
      sprite?: string;
    },
  ) {
    return await this.prisma.mapSprites.update({
      where: {
        id: id,
      },
      data: { ...values },
    });
  }

  async deleteSpriteById(spriteId: number) {
    return await this.prisma.mapSprites.delete({
      where: {
        id: spriteId,
      },
    });
  }
}
