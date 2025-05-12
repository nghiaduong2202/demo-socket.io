import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { ActivePerson } from 'src/auths/decorators/active-person.decorator';
import { UUID } from 'crypto';
import { CreateConversationDto } from './dtos/create-conversation.dto';
import { CreateGroupConversationDto } from './dtos/create-group-conversation.dto';
import { SendMessageDto } from './dtos/send-message.dto';

@Controller('api/message')
@AuthRoles(AuthRoleEnum.USER)
export class MessageController {
  constructor(
    /**
     * inject MessageService
     */
    private readonly messageService: MessageService,
  ) {}

  @Get()
  getConversation(@ActivePerson('sub') personId: UUID) {
    return this.messageService.getConversations(personId);
  }

  @Post('conversation')
  createConversation(
    @ActivePerson('sub') personId: UUID,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    return this.messageService.createConversation(
      createConversationDto,
      personId,
    );
  }

  @Post('group-conversation')
  createGroupConversation(
    @Body() createGroupConversationDto: CreateGroupConversationDto,
    @ActivePerson('sub') personId: UUID,
  ) {
    return this.messageService.createGroupConversation(
      createGroupConversationDto,
      personId,
    );
  }

  @Post('send')
  sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @ActivePerson('sub') personId: UUID,
  ) {
    return this.messageService.sendMessage(sendMessageDto, personId);
  }
}
