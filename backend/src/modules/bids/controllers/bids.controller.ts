import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BidsService } from '../services/bids.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

@Controller('bids')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.WRITER)
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post() 
  placeBid(@Param('jobId') jobId: string, @Req() req) {
    return this.bidsService.placeBid(req.user.id, { job_id: jobId });
  }

  @Get('/my-bids')
  listBids(@Req() req, @Query() query: PaginationQueryDto) {
    return this.bidsService.listBids(req.user.id, query.page ?? 1);
  }

  @Get(':bidId')
  getBid(@Req() req, @Param('bidId') bidId: string) {
    return this.bidsService.getBidById(req.user.id, bidId);
  }

  @Delete(':bidId')
  deleteBid(@Req() req, @Param('bidId') bidId: string) {
    return this.bidsService.deleteBid(req.user.id, bidId);
  }
}

@Controller('bids')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.WRITER)
export class WriterBidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Get()
  listBids(@Req() req, @Query() query: PaginationQueryDto) {
    return this.bidsService.listBids(req.user.id, query.page ?? 1);
  }

  @Get(':bidId')
  getBid(@Req() req, @Param('bidId') bidId: string) {
    return this.bidsService.getBidById(req.user.id, bidId);
  }

  @Delete(':bidId')
  deleteBid(@Req() req, @Param('bidId') bidId: string) {
    return this.bidsService.deleteBid(req.user.id, bidId);
  }
}