import { UUID } from 'crypto';
import { Conversation } from './conversation.entity';
import { Person } from 'src/people/person.entity';
import { Message } from './message.entity';
export declare class Participant {
    conversationId: UUID;
    userId: UUID;
    isAdmin: boolean;
    createdAt: Date;
    conversation: Conversation;
    user: Person;
    see?: Message;
}
