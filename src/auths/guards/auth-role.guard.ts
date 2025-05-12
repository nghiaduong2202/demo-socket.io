import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRoleEnum } from '../enums/auth-role.enum';
import { UserGuard } from './user.guard';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthRoleGuard implements CanActivate {
  private static readonly defaultRole = AuthRoleEnum.USER;

  private get roleGuardMap(): Record<AuthRoleEnum, CanActivate> {
    return {
      [AuthRoleEnum.NONE]: { canActivate: () => true },
      [AuthRoleEnum.USER]: this.userGuard,
    };
  }

  constructor(
    /**
     * inject UserGuard
     */
    private readonly userGuard: UserGuard,
    /**
     * Inject Reflector
     */
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<AuthRoleEnum[]>(
      'auth-roles',
      [context.getHandler(), context.getClass()],
    ) || [AuthRoleGuard.defaultRole];

    const guards = roles.map((authRole) => this.roleGuardMap[authRole]).flat();

    for (const instance of guards) {
      const canActivate = await instance.canActivate(context);

      if (canActivate) {
        return true;
      }
    }

    throw new UnauthorizedException();
  }
}
