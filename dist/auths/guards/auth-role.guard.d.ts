import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserGuard } from './user.guard';
import { Reflector } from '@nestjs/core';
export declare class AuthRoleGuard implements CanActivate {
    private readonly userGuard;
    private readonly reflector;
    private static readonly defaultRole;
    private get roleGuardMap();
    constructor(userGuard: UserGuard, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
