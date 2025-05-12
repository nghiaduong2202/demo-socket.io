import { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { Person } from 'src/people/person.entity';
import { Message } from './message.entity';

@Entity()
export class Participant {
  @PrimaryColumn()
  conversationId: UUID;

  @PrimaryColumn()
  userId: UUID;

  @Column({
    type: 'bool',
    default: false,
  })
  isAdmin: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @ManyToOne(() => Conversation, (conversation) => conversation.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'conversationId',
  })
  conversation: Conversation;

  @ManyToOne(() => Person, (person) => person.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
  })
  user: Person;

  @ManyToOne(() => Message, (message) => message.participants, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn()
  see?: Message;
}
