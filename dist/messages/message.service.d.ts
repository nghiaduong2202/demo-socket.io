import { UUID } from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { Participant } from './entities/participant.entity';
import { CreateConversationDto } from './dtos/create-conversation.dto';
import { CreateGroupConversationDto } from './dtos/create-group-conversation.dto';
import { SendMessageDto } from './dtos/send-message.dto';
import { PersonService } from 'src/people/person.service';
import { SeenMessageDto } from './dtos/seen-message.dto';
export declare class MessageService {
    private readonly messageRepository;
    private readonly conversationRepository;
    private readonly participantRepository;
    private readonly dataSource;
    private readonly personService;
    constructor(messageRepository: Repository<Message>, conversationRepository: Repository<Conversation>, participantRepository: Repository<Participant>, dataSource: DataSource, personService: PersonService);
    getInfoConversations(personId: UUID): Promise<Conversation[]>;
    getConversations(personId: UUID): Promise<{
        unreadMessageCount: number;
        id: UUID;
        isGroup: boolean;
        title?: string;
        createdAt: Date;
        participants: Participant[];
        messages: Message[];
    }[]>;
    createConversation(createConversationDto: CreateConversationDto, personId: UUID): Promise<{
        message: string;
    }>;
    createGroupConversation(createGroupConversationDto: CreateGroupConversationDto, personId: UUID): Promise<{
        message: string;
    }>;
    sendMessage(sendMessageDto: SendMessageDto, personId: UUID): Promise<{
        message: string;
    }>;
    seenMessage(seenMessageDto: SeenMessageDto, personId: UUID): Promise<{
        message: string;
    }>;
}
