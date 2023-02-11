import {
  Controller,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { ExploreService } from './explore.service';

@UseGuards(JwtGuard)
@Controller('explore')
export class ExploreController {
  constructor(
    private ExploreService: ExploreService,
  ) {}
}
