import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Participant } from './entities/participant.entity';
import { CreateConversationDto } from './dtos/create-conversation.dto';
import { CreateGroupConversationDto } from './dtos/create-group-conversation.dto';
import { SendMessageDto } from './dtos/send-message.dto';
import { PersonService } from 'src/people/person.service';
import { SeenMessageDto } from './dtos/seen-message.dto';

@Injectable()
export class MessageService {
  constructor(
    /**
     * inject MessageRepostiory
     */
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    /**
     * inject ConversationRepository
     */
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    /**
     * inject ParticipantRepository
     */
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    /**
     * inject DateSource
     */
    private readonly dataSource: DataSource,
    /**
     * inject PersonService
     */
    private readonly personService: PersonService,
  ) {}

  public async getInfoConversations(personId: UUID) {
    const conversations = await this.conversationRepository.find({
      where: {
        participants: {
          userId: personId,
        },
      },
    });

    return conversations;
  }

  public async getConversations(personId: UUID) {
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
      const see = conversation.participants.find(
        (participant) => participant.userId === personId,
      )!.see;

      let unreadMessageCount: number;
      if (!see) {
        unreadMessageCount = conversation.messages.length;
      } else {
        unreadMessageCount = conversation.messages.filter(
          (message) => message.createdAt > see.createdAt,
        ).length;
      }
      return {
        ...conversation,
        unreadMessageCount,
      };
    });
    return result;
  }

  public async createConversation(
    createConversationDto: CreateConversationDto,
    personId: UUID,
  ) {
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
      throw new BadRequestException('The conversation is existed');
    }

    await this.dataSource.transaction(async (manager) => {
      const conversation = manager.create(Conversation, {
        isGroup: false,
      });

      await manager.save(conversation);

      const participant1 = manager.create(Participant, {
        userId: personId,
        conversation,
      });

      const participant2 = manager.create(Participant, {
        userId: createConversationDto.userId,
        conversation,
      });

      await manager.save([participant1, participant2]);
    });

    return {
      message: 'Create conversation successful',
    };
  }

  public async createGroupConversation(
    createGroupConversationDto: CreateGroupConversationDto,
    personId: UUID,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const conversation = manager.create(Conversation, {
        isGroup: true,
        title: createGroupConversationDto.title,
      });

      await manager.save(conversation);

      for (const member of createGroupConversationDto.members) {
        const participant = manager.create(Participant, {
          userId: member,
          conversation: conversation,
        });

        await manager.save(participant);
      }

      const adminConversation = manager.create(Participant, {
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

  public async sendMessage(sendMessageDto: SendMessageDto, personId: UUID) {
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
        throw new NotFoundException('Not found the conversation');
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
        throw new NotFoundException('Not found participant');
      });

    participant.see = message;

    await this.participantRepository.save(participant);

    return {
      message: 'Send message successful',
    };
  }

  public async seenMessage(seenMessageDto: SeenMessageDto, personId: UUID) {
    const participant = await this.participantRepository
      .findOneOrFail({
        where: {
          userId: personId,
          conversationId: seenMessageDto.conversationId,
        },
      })
      .catch(() => {
        throw new BadRequestException('Not found the participant');
      });

    const message = await this.messageRepository
      .findOneOrFail({
        where: {
          id: seenMessageDto.messageId,
        },
      })
      .catch(() => {
        throw new BadRequestException('Not found the message');
      });

    participant.see = message;

    await this.participantRepository.save(participant);

    return { message: 'Seen message successful' };
  }
}
