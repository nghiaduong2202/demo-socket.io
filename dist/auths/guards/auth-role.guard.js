"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthRoleGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoleGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_role_enum_1 = require("../enums/auth-role.enum");
const user_guard_1 = require("./user.guard");
const core_1 = require("@nestjs/core");
let AuthRoleGuard = class AuthRoleGuard {
    static { AuthRoleGuard_1 = this; }
    userGuard;
    reflector;
    static defaultRole = auth_role_enum_1.AuthRoleEnum.USER;
    get roleGuardMap() {
        return {
            [auth_role_enum_1.AuthRoleEnum.NONE]: { canActivate: () => true },
            [auth_role_enum_1.AuthRoleEnum.USER]: this.userGuard,
        };
    }
    constructor(userGuard, reflector) {
        this.userGuard = userGuard;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const roles = this.reflector.getAllAndOverride('auth-roles', [context.getHandler(), context.getClass()]) || [AuthRoleGuard_1.defaultRole];
        const guards = roles.map((authRole) => this.roleGuardMap[authRole]).flat();
        for (const instance of guards) {
            const canActivate = await instance.canActivate(context);
            if (canActivate) {
                return true;
            }
        }
        throw new common_1.UnauthorizedException();
    }
};
exports.AuthRoleGuard = AuthRoleGuard;
exports.AuthRoleGuard = AuthRoleGuard = AuthRoleGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_guard_1.UserGuard,
        core_1.Reflector])
], AuthRoleGuard);
//# sourceMappingURL=auth-role.guard.js.map