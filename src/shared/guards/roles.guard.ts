import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../common';

@Injectable()
export class AuthenticationGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>('public', context.getHandler());
    if (isPublic) {
      return true;
    }

    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!roles) {
      return true;
    }

    if (user && roles.indexOf(user.role) < 0) {
      throw new ForbiddenException(`${user.email} is not authorized to perform the operation.`);
    }

    return true;
  }
}
