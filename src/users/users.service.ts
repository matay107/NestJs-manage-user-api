import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { throws } from 'assert';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const data = { email, password };
    const user = this.repo.create(data);

    return this.repo.save(user);
  }

  async findOne(id: number) {
    const data = await this.repo.findOneBy({
      id,
    });

    return data;
  }

  findAll() {
    return this.repo.find();
  }

  find(email: string) {
    return this.repo.find({
      where: {
        email
      },
    });
  }

  async update(id: number, attrs: Partial<User>) {
    const data = await this.repo.findOneBy({
      id,
    });

    if (!data) {
      throw new NotFoundException('Data not found.');
    }
    Object.assign(data, attrs);
    return this.repo.save(data);
  }

  async remove(id: number) {
    const data = await this.repo.findOneBy({
      id,
    });

    if (!data) {
      throw new NotFoundException('Data not found.');
    }
    return this.repo.remove(data);
  }
}
