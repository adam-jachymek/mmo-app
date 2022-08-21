import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePartyDto,
  EditPartyDto,
} from './dto';
import { UserService } from 'src/user/user.service';
import { connect } from 'http2';
import { use } from 'passport';

@Injectable()
export class PartyService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createParty(userId: number) {
    // const party = await this.prisma.party.create({
    //   data: {
    //     leaderId: userId,
    //     usersInParty: {
    //       create: [
    //         {
    //           user: {
    //             connect: {
    //               id: userId,
    //             },
    //           },
    //         },
    //       ],
    //     },
    //   },
    // });
    // return party;
  }

  async returnParty(partyId: number) {
    // const getParty =
    //   await this.prisma.party.findUnique({
    //     where: {
    //       id: partyId,
    //     },
    //     include: {
    //       usersInParty: {
    //         select: {
    //           user: true,
    //         },
    //       },
    //     },
    //   });
    // return getParty;
  }
}
