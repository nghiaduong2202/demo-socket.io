import { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { Person } from 'src/people/person.entity';
import { Participant } from './participant.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({
    type: 'text',
    nullable: true,
  })
  content?: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @Column({
    type: 'varchar',
    array: true,
    nullable: true,
  })
  images?: string[];

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  conversation: Conversation;

  @ManyToOne(() => Person, (person) => person.messages, {
    onDelete: 'CASCADE',
  })
  user: Person;

  @OneToMany(() => Participant, (participants) => participants.see)
  participants: Participant[];
}
