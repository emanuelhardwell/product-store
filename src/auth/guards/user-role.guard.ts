import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from '../decorators/role-protected.decorator';

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

    const authorizedRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!authorizedRoles) return true;
    if (authorizedRoles.length === 0) return true;

    for (const role of rolesUser) {
      if (authorizedRoles.includes(role)) {
        return true;
        // return false;
      }
    }

    throw new ForbiddenException(
      `User: ${user.fullName} needs a valid role: (${authorizedRoles})`,
    );
  }
}
