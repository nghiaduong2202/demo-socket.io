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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const person_entity_1 = require("./person.entity");
const typeorm_2 = require("@nestjs/typeorm");
let PersonService = class PersonService {
    personRepository;
    constructor(personRepository) {
        this.personRepository = personRepository;
    }
    async createOne(createOnePersonDto) {
        const person = this.personRepository.create(createOnePersonDto);
        try {
            await this.personRepository.save(person);
        }
        catch (error) {
            throw new common_1.BadRequestException(String(error));
        }
        return person;
    }
    async findOneByEmail(email) {
        return this.personRepository
            .findOneOrFail({
            where: {
                email,
            },
        })
            .catch(() => {
            throw new common_1.NotFoundException('Not found the person');
        });
    }
    async findOneById(personId) {
        return this.personRepository
            .findOneOrFail({
            where: {
                id: personId,
            },
        })
            .catch(() => {
            throw new common_1.NotFoundException('Not found the person');
        });
    }
};
exports.PersonService = PersonService;
exports.PersonService = PersonService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(person_entity_1.Person)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], PersonService);
//# sourceMappingURL=person.service.js.map