"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const message_module_1 = require("./messages/message.module");
const auth_module_1 = require("./auths/auth.module");
const person_module_1 = require("./people/person.module");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const auth_role_guard_1 = require("./auths/guards/auth-role.guard");
const user_guard_1 = require("./auths/guards/user.guard");
const jwt_1 = require("@nestjs/jwt");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            message_module_1.MessageModule,
            auth_module_1.AuthModule,
            person_module_1.PersonModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    autoLoadEntities: configService.get('DATABASE_AUTOLOAD'),
                    synchronize: configService.get('DATABASE_SYNC'),
                    port: configService.get('DATABASE_PORT'),
                    username: configService.get('DATABASE_USERNAME'),
                    password: configService.get('DATABASE_PASSWORD'),
                    host: configService.get('DATABASE_HOST'),
                    database: configService.get('DATABASE_NAME'),
                    logging: true,
                }),
            }),
            jwt_1.JwtModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: auth_role_guard_1.AuthRoleGuard,
            },
            user_guard_1.UserGuard,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map