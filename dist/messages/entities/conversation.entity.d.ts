import { UUID } from 'crypto';
import { Participant } from './participant.entity';
import { Message } from './message.entity';
export declare class Conversation {
    id: UUID;
    isGroup: boolean;
    title?: string;
    createdAt: Date;
    participants: Participant[];
    messages: Message[];
}
