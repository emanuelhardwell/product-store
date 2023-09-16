import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,

    configModule: ConfigModule,
  ) {
    super();
  }

  async validate(payload: JwtPayloadInterface): Promise<User> {
    const { email } = payload;

    const user = await this.authRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('User Unauthorized');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    return user;
  }
}
