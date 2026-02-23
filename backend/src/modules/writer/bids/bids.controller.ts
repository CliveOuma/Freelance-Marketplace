import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

/**
 * Writer Bids: place bid and list own bids.
 * Postman:
 *   POST /api/writer/bids — Body (JSON): { job_id, bid_amount, message } → 201 Created.
 *   GET /api/writer/bids?page=1 → 200 OK, paginated list of writer's bids.
 */
@Controller('writer/bids')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.WRITER)
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  placeBid(@Req() req: { user: { id: string } }, @Body() dto: CreateBidDto) {
    return this.bidsService.placeBid(req.user.id, dto);
  }

  @Get()
  listBids(
    @Req() req: { user: { id: string } },
    @Query() query: PaginationQueryDto,
  ) {
    return this.bidsService.listBids(req.user.id, query.page ?? 1);
  }

  @Get(':bidId')
  getBid(
    @Req() req: { user: { id: string } },
    @Param('bidId') bidId: string,
  ) {
    return this.bidsService.getBidById(req.user.id, bidId);
  }

  @Delete(':bidId')
  deleteBid(
    @Req() req: { user: { id: string } },
    @Param('bidId') bidId: string,
  ) {
    return this.bidsService.deleteBid(req.user.id, bidId);
  }
}