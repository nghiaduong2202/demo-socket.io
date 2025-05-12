"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const person_module_1 = require("../people/person.module");
const bcrypt_provider_1 = require("./providers/bcrypt.provider");
const hash_provider_1 = require("./providers/hash.provider");
const token_provider_1 = require("./providers/token.provider");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            person_module_1.PersonModule,
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRE'),
                        issuer: configService.get('JWT_TOKEN_ISSUER'),
                        audience: configService.get('JWT_TOKEN_AUDIENCE'),
                    },
                }),
            }),
        ],
        providers: [
            auth_service_1.AuthService,
            bcrypt_provider_1.BcryptProvider,
            {
                provide: hash_provider_1.HashProvider,
                useClass: bcrypt_provider_1.BcryptProvider,
            },
            token_provider_1.TokenProvider,
        ],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map