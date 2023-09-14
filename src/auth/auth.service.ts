import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userProperties } = createUserDto;
    const user = this.userRepository.create({
      ...userProperties,
      password: bcrypt.hashSync(password, 10),
    });
    await this.userRepository.save(user);
    return user;
  }
}
