import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { WriterDashboardService } from '../services/writer-dashboard.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';


@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.WRITER)
export class WriterDashboardController {
  constructor(private readonly dashboardService: WriterDashboardService) {}

  @Get('dashboard')
  getDashboard(@Req() req: { user: { id: string } }) {
    return this.dashboardService.getSummary(req.user.id);
  }
}
