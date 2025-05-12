import { UUID } from 'crypto';
import { Conversation } from './conversation.entity';
import { Person } from 'src/people/person.entity';
import { Participant } from './participant.entity';
export declare class Message {
    id: UUID;
    content?: string;
    createdAt: Date;
    images?: string[];
    conversation: Conversation;
    user: Person;
    participants: Participant[];
}
