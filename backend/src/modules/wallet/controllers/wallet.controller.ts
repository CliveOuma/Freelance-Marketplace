import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { WalletService } from '../services/wallet.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';


@Controller('wallet')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.WRITER)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  getWallet(
    @Req() req: { user: { id: string } },
    @Query() query: PaginationQueryDto,
  ) {
    return this.walletService.getWalletWithTransactions(
      req.user.id,
      query.page ?? 1,
    );
  }
  
  /*
  @Post('deposit')
  postDeposit(
    @Req() req: { user: { id: string } },
    @Query() query: PaginationQueryDto,
  ) {
    return this.walletService.depositMoney(
      req.user.id,
      query.page ?? 1,
    );
  } */
 
}