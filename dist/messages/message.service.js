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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const message_entity_1 = require("./entities/message.entity");
const typeorm_2 = require("@nestjs/typeorm");
const conversation_entity_1 = require("./entities/conversation.entity");
const participant_entity_1 = require("./entities/participant.entity");
const person_service_1 = require("../people/person.service");
let MessageService = class MessageService {
    messageRepository;
    conversationRepository;
    participantRepository;
    dataSource;
    personService;
    constructor(messageRepository, conversationRepository, participantRepository, dataSource, personService) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.participantRepository = participantRepository;
        this.dataSource = dataSource;
        this.personService = personService;
    }
    async getInfoConversations(personId) {
        const conversations = await this.conversationRepository.find({
            where: {
                participants: {
                    userId: personId,
                },
            },
        });
        return conversations;
    }
    async getConversations(personId) {
        const conversations = await this.conversationRepository
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.messages', 'allMessages')
            .leftJoinAndSelect('allMessages.user', 'sender')
            .innerJoin('c.participants', 'p')
            .leftJoinAndSelect('c.participants', 'allParticipants')
            .leftJoinAndSelect('allParticipants.user', 'user')
            .leftJoinAndSelect('allParticipants.see', 'see')
            .where('p.userId = :userId', { userId: personId })
            .getMany();
        const result = conversations.map((conversation) => {
            const see = conversation.participants.find((participant) => participant.userId === personId).see;
            let unreadMessageCount;
            if (!see) {
                unreadMessageCount = conversation.messages.length;
            }
            else {
                unreadMessageCount = conversation.messages.filter((message) => message.createdAt > see.createdAt).length;
            }
            return {
                ...conversation,
                unreadMessageCount,
            };
        });
        return result;
    }
    async createConversation(createConversationDto, personId) {
        const existingConversation = await this.conversationRepository
            .createQueryBuilder('c')
            .innerJoin('c.participants', 'p')
            .where('c.isGroup = :isGroup', { isGroup: false })
            .andWhere('p.userId In (:...userIds)', {
            userIds: [personId, createConversationDto.userId],
        })
            .groupBy('c.id')
            .having('COUNT(DISTINCT p.userId) = 2')
            .getOne();
        if (existingConversation) {
            throw new common_1.BadRequestException('The conversation is existed');
        }
        await this.dataSource.transaction(async (manager) => {
            const conversation = manager.create(conversation_entity_1.Conversation, {
                isGroup: false,
            });
            await manager.save(conversation);
            const participant1 = manager.create(participant_entity_1.Participant, {
                userId: personId,
                conversation,
            });
            const participant2 = manager.create(participant_entity_1.Participant, {
                userId: createConversationDto.userId,
                conversation,
            });
            await manager.save([participant1, participant2]);
        });
        return {
            message: 'Create conversation successful',
        };
    }
    async createGroupConversation(createGroupConversationDto, personId) {
        await this.dataSource.transaction(async (manager) => {
            const conversation = manager.create(conversation_entity_1.Conversation, {
                isGroup: true,
                title: createGroupConversationDto.title,
            });
            await manager.save(conversation);
            for (const member of createGroupConversationDto.members) {
                const participant = manager.create(participant_entity_1.Participant, {
                    userId: member,
                    conversation: conversation,
                });
                await manager.save(participant);
            }
            const adminConversation = manager.create(participant_entity_1.Participant, {
                userId: personId,
                conversation,
                isAdmin: true,
            });
            await manager.save(adminConversation);
        });
        return {
            message: 'Create group conversation successful',
        };
    }
    async sendMessage(sendMessageDto, personId) {
        const conversation = await this.conversationRepository
            .findOneOrFail({
            where: {
                id: sendMessageDto.conversationId,
                participants: {
                    userId: personId,
                },
            },
        })
            .catch(() => {
            throw new common_1.NotFoundException('Not found the conversation');
        });
        const person = await this.personService.findOneById(personId);
        const message = this.messageRepository.create({
            content: sendMessageDto.message,
            conversation,
            user: person,
        });
        await this.messageRepository.save(message);
        const participant = await this.participantRepository
            .findOneOrFail({
            where: {
                userId: personId,
                conversationId: conversation.id,
            },
        })
            .catch(() => {
            throw new common_1.NotFoundException('Not found participant');
        });
        participant.see = message;
        await this.participantRepository.save(participant);
        return {
            message: 'Send message successful',
        };
    }
    async seenMessage(seenMessageDto, personId) {
        const participant = await this.participantRepository
            .findOneOrFail({
            where: {
                userId: personId,
                conversationId: seenMessageDto.conversationId,
            },
        })
            .catch(() => {
            throw new common_1.BadRequestException('Not found the participant');
        });
        const message = await this.messageRepository
            .findOneOrFail({
            where: {
                id: seenMessageDto.messageId,
            },
        })
            .catch(() => {
            throw new common_1.BadRequestException('Not found the message');
        });
        participant.see = message;
        await this.participantRepository.save(participant);
        return { message: 'Seen message successful' };
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(message_entity_1.Message)),
    __param(1, (0, typeorm_2.InjectRepository)(conversation_entity_1.Conversation)),
    __param(2, (0, typeorm_2.InjectRepository)(participant_entity_1.Participant)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.DataSource,
        person_service_1.PersonService])
], MessageService);
//# sourceMappingURL=message.service.js.map