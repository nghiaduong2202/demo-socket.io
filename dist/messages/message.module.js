"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModule = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const message_controller_1 = require("./message.controller");
const message_gateway_1 = require("./message.gateway");
const typeorm_1 = require("@nestjs/typeorm");
const conversation_entity_1 = require("./entities/conversation.entity");
const message_entity_1 = require("./entities/message.entity");
const participant_entity_1 = require("./entities/participant.entity");
const person_module_1 = require("../people/person.module");
const auth_module_1 = require("../auths/auth.module");
let MessageModule = class MessageModule {
};
exports.MessageModule = MessageModule;
exports.MessageModule = MessageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([conversation_entity_1.Conversation, message_entity_1.Message, participant_entity_1.Participant]),
            person_module_1.PersonModule,
            auth_module_1.AuthModule,
        ],
        providers: [message_service_1.MessageService, message_gateway_1.MessageGateway],
        controllers: [message_controller_1.MessageController],
        exports: [message_service_1.MessageService],
    })
], MessageModule);
//# sourceMappingURL=message.module.js.map