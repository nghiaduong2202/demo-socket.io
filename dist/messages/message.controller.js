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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const auth_role_decorator_1 = require("../auths/decorators/auth-role.decorator");
const auth_role_enum_1 = require("../auths/enums/auth-role.enum");
const active_person_decorator_1 = require("../auths/decorators/active-person.decorator");
const create_conversation_dto_1 = require("./dtos/create-conversation.dto");
const create_group_conversation_dto_1 = require("./dtos/create-group-conversation.dto");
const send_message_dto_1 = require("./dtos/send-message.dto");
let MessageController = class MessageController {
    messageService;
    constructor(messageService) {
        this.messageService = messageService;
    }
    getConversation(personId) {
        return this.messageService.getConversations(personId);
    }
    createConversation(personId, createConversationDto) {
        return this.messageService.createConversation(createConversationDto, personId);
    }
    createGroupConversation(createGroupConversationDto, personId) {
        return this.messageService.createGroupConversation(createGroupConversationDto, personId);
    }
    sendMessage(sendMessageDto, personId) {
        return this.messageService.sendMessage(sendMessageDto, personId);
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, active_person_decorator_1.ActivePerson)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Post)('conversation'),
    __param(0, (0, active_person_decorator_1.ActivePerson)('sub')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_conversation_dto_1.CreateConversationDto]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "createConversation", null);
__decorate([
    (0, common_1.Post)('group-conversation'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, active_person_decorator_1.ActivePerson)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_group_conversation_dto_1.CreateGroupConversationDto, String]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "createGroupConversation", null);
__decorate([
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, active_person_decorator_1.ActivePerson)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_dto_1.SendMessageDto, String]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "sendMessage", null);
exports.MessageController = MessageController = __decorate([
    (0, common_1.Controller)('api/message'),
    (0, auth_role_decorator_1.AuthRoles)(auth_role_enum_1.AuthRoleEnum.USER),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], MessageController);
//# sourceMappingURL=message.controller.js.map