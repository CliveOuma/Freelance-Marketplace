import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Writer-only endpoints
  @Get('dashboard')
  @UseGuards(RolesGuard)
  @Roles(Role.WRITER)
  getDashboard(@Req() req: { user: { id: string } }) {
    return this.usersService.getDashboard(req.user.id);
  }

  @Get('wallet')
  @UseGuards(RolesGuard)
  @Roles(Role.WRITER)
  getWallet(
    @Req() req: { user: { id: string } },
    @Query() query: PaginationQueryDto,
  ) {
    return this.usersService.getWallet(req.user.id, query.page ?? 1);
  }

  //Admin only
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query.page ?? 1);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }


  @Get(':id')
  @UseGuards(RolesGuard)
  findOne(
    @Param('id') id: string,
    @Req() req: { user: { id: string; role: string } },
  ) {
    return this.usersService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Req() req: { user: { id: string; role: string } },
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, req.user.id, req.user.role, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      phoneNumber: dto.phoneNumber,
    });
  }
}
