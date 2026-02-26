// users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';

@Module({
  controllers: [UsersController, ProfileController],
  providers: [UsersService, UsersRepository, ProfileService],
  exports: [UsersService, ProfileService],
})
export class UsersModule {}