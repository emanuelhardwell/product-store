import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const data = context.switchToHttp().getRequest();
    const user = data.user as User;

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const rolesUser = user.roles;

    const authorizedRoles = this.reflector.get('roles', context.getHandler());

    for (const role of rolesUser) {
      if (!authorizedRoles.includes(role)) {
        throw new ForbiddenException(
          `User: ${user.fullName} needs a valid role: (${authorizedRoles})`,
        );
        // return false;
      }
    }

    return true;
  }
}
