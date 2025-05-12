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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const hash_provider_1 = require("./providers/hash.provider");
const person_service_1 = require("../people/person.service");
const config_1 = require("@nestjs/config");
const token_provider_1 = require("./providers/token.provider");
let AuthService = class AuthService {
    hashProvider;
    personServicce;
    configService;
    tokenProvider;
    constructor(hashProvider, personServicce, configService, tokenProvider) {
        this.hashProvider = hashProvider;
        this.personServicce = personServicce;
        this.configService = configService;
        this.tokenProvider = tokenProvider;
    }
    async register(createOnePersonDto) {
        createOnePersonDto.password = await this.hashProvider.hashPassword(createOnePersonDto.password);
        const person = await this.personServicce.createOne(createOnePersonDto);
        const payload = {
            role: 'user',
        };
        const token = await this.tokenProvider.generate(person.id, this.configService.get('JWT_SECRET'), this.configService.get('JWT_EXPIRE'), payload);
        return {
            token,
        };
    }
    async login(loginDto) {
        const person = await this.personServicce.findOneByEmail(loginDto.email);
        const isEqual = await this.hashProvider.comparePassword(loginDto.password, person.password);
        if (!isEqual) {
            throw new common_1.ForbiddenException('Email or password fail');
        }
        const payload = {
            role: 'user',
        };
        const token = await this.tokenProvider.generate(person.id, this.configService.get('JWT_SECRET'), this.configService.get('JWT_EXPIRE'), payload);
        return {
            token,
        };
    }
    async verifyAccessToken(token) {
        return this.tokenProvider.verify(token, this.configService.get('JWT_SECRET'));
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [hash_provider_1.HashProvider,
        person_service_1.PersonService,
        config_1.ConfigService,
        token_provider_1.TokenProvider])
], AuthService);
//# sourceMappingURL=auth.service.js.map