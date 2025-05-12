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
exports.Participant = void 0;
const typeorm_1 = require("typeorm");
const conversation_entity_1 = require("./conversation.entity");
const person_entity_1 = require("../../people/person.entity");
const message_entity_1 = require("./message.entity");
let Participant = class Participant {
    conversationId;
    userId;
    isAdmin;
    createdAt;
    conversation;
    user;
    see;
};
exports.Participant = Participant;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Participant.prototype, "conversationId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Participant.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'bool',
        default: false,
    }),
    __metadata("design:type", Boolean)
], Participant.prototype, "isAdmin", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], Participant.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => conversation_entity_1.Conversation, (conversation) => conversation.participants, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({
        name: 'conversationId',
    }),
    __metadata("design:type", conversation_entity_1.Conversation)
], Participant.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => person_entity_1.Person, (person) => person.participants, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({
        name: 'userId',
    }),
    __metadata("design:type", person_entity_1.Person)
], Participant.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => message_entity_1.Message, (message) => message.participants, {
        onDelete: 'RESTRICT',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", message_entity_1.Message)
], Participant.prototype, "see", void 0);
exports.Participant = Participant = __decorate([
    (0, typeorm_1.Entity)()
], Participant);
//# sourceMappingURL=participant.entity.js.map