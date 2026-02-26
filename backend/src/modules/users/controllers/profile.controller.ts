import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';


@Controller('user')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile')
  async getProfile(@Req() req: { user: { id: string } }) {
    return this.profileService.getProfile(req.user.id);
  }

  @Patch('profile')
  async updateProfile(
    @Req() req: { user: { id: string } },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(req.user.id, dto);
  }
}
