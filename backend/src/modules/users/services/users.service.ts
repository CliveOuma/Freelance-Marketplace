import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async getById(id: string) {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll() {
    return this.usersRepo.findAll();
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.getById(id);
    return this.usersRepo.update(id, dto);
  }

  async delete(id: string) {
    await this.getById(id);
    return this.usersRepo.delete(id);
  }

  async create(data: any) {
    return this.usersRepo.create(data);
  }
}