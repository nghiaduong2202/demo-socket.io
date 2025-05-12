import { MessageService } from './message.service';
import { UUID } from 'crypto';
import { CreateConversationDto } from './dtos/create-conversation.dto';
import { CreateGroupConversationDto } from './dtos/create-group-conversation.dto';
import { SendMessageDto } from './dtos/send-message.dto';
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    getConversation(personId: UUID): Promise<{
        unreadMessageCount: number;
        id: UUID;
        isGroup: boolean;
        title?: string;
        createdAt: Date;
        participants: import("./entities/participant.entity").Participant[];
        messages: import("./entities/message.entity").Message[];
    }[]>;
    createConversation(personId: UUID, createConversationDto: CreateConversationDto): Promise<{
        message: string;
    }>;
    createGroupConversation(createGroupConversationDto: CreateGroupConversationDto, personId: UUID): Promise<{
        message: string;
    }>;
    sendMessage(sendMessageDto: SendMessageDto, personId: UUID): Promise<{
        message: string;
    }>;
}
