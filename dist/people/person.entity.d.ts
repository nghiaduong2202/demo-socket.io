import { UUID } from 'crypto';
import { Message } from 'src/messages/entities/message.entity';
import { Participant } from 'src/messages/entities/participant.entity';
export declare class Person {
    id: UUID;
    name: string;
    password: string;
    email: string;
    age?: Date;
    createdAt: Date;
    participants: Participant[];
    messages: Message[];
}
