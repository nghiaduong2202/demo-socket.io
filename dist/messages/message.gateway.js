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
exports.MessageGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auths/auth.service");
const bad_request_filter_1 = require("./filters/bad-request.filter");
const message_service_1 = require("./message.service");
const send_message_dto_1 = require("./dtos/send-message.dto");
const seen_message_dto_1 = require("./dtos/seen-message.dto");
let MessageGateway = class MessageGateway {
    authService;
    messageService;
    server;
    connectedUsers = new Map();
    constructor(authService, messageService) {
        this.authService = authService;
        this.messageService = messageService;
    }
    afterInit(server) { }
    async handleConnection(client) {
        const token = client.handshake.headers.authorization;
        try {
            const payload = (await this.authService.verifyAccessToken(token));
            this.connectedUsers.set(client.id, payload.sub);
            this.emitConnectedUser();
            const conversations = await this.messageService.getInfoConversations(payload.sub);
            for (const conversation of conversations) {
                await client.join(conversation.id);
            }
        }
        catch (error) {
            console.log(String(error));
            client.emit('exception', String(error));
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.connectedUsers.delete(client.id);
        this.emitConnectedUser();
    }
    emitConnectedUser() {
        const result = new Set(this.connectedUsers.values());
        this.server.emit('connectedUsers', Array.from(result));
    }
    async handleMessage(client, sendMessageDto) {
        const personId = this.connectedUsers.get(client.id);
        await this.messageService.sendMessage(sendMessageDto, personId);
        this.server
            .to(sendMessageDto.conversationId)
            .emit('receive-message', { personId, sendMessageDto });
    }
    async handleSeenMessaage(client, seenMessageDto) {
        const personId = this.connectedUsers.get(client.id);
        await this.messageService.seenMessage(seenMessageDto, personId);
        this.server.to(seenMessageDto.conversationId).emit('seen', {
            personId,
            ...seenMessageDto,
        });
    }
};
exports.MessageGateway = MessageGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessageGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('send-message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('seen-message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        seen_message_dto_1.SeenMessageDto]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleSeenMessaage", null);
exports.MessageGateway = MessageGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'ws/message',
        cors: {
            origin: '*',
        },
    }),
    (0, common_1.UseFilters)(new bad_request_filter_1.BadRequestFilter()),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        message_service_1.MessageService])
], MessageGateway);
//# sourceMappingURL=message.gateway.js.map