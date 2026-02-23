import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { WriterDashboardService } from './writer-dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

/**
 * Writer Dashboard Summary.
 * Postman: GET /api/writer/dashboard
 * Headers: Authorization: Bearer <token> (from POST /auth/login as WRITER)
 * Response: 200 OK with { wallet_balance, available_bids, pending_submissions, status }.
 */
@Controller('writer/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.WRITER)
export class WriterDashboardController {
  constructor(private readonly dashboardService: WriterDashboardService) {}

  @Get()
  getDashboard(@Req() req: { user: { id: string } }) {
    return this.dashboardService.getSummary(req.user.id);
  }
}
