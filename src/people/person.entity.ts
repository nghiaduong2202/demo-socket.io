import { UUID } from 'crypto';
import { Message } from 'src/messages/entities/message.entity';
import { Participant } from 'src/messages/entities/participant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  age?: Date;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @OneToMany(() => Participant, (participants) => participants.user)
  participants: Participant[];

  @OneToMany(() => Message, (messages) => messages.user)
  messages: Message[];
}
