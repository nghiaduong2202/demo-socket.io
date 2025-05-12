import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from 'src/auths/auth.service';
import { BadRequestFilter } from './filters/bad-request.filter';
import { UUID } from 'crypto';
import { ActivePersonData } from 'src/auths/interfaces/active-person-data.interface';
import { MessageService } from './message.service';
import { SendMessageDto } from './dtos/send-message.dto';
import { SeenMessageDto } from './dtos/seen-message.dto';

@WebSocketGateway({
  namespace: 'ws/message',
  cors: {
    origin: '*',
  },
})
@UseFilters(new BadRequestFilter())
@UsePipes(new ValidationPipe())
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  connectedUsers: Map<string, UUID> = new Map<string, UUID>();

  constructor(
    /**
     * inject AuthService
     */
    private readonly authService: AuthService,
    /**
     * inject MessageService
     */
    private readonly messageService: MessageService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization!;
    try {
      const payload = (await this.authService.verifyAccessToken(
        token,
      )) as ActivePersonData;

      this.connectedUsers.set(client.id, payload.sub);
      this.emitConnectedUser();

      const conversations = await this.messageService.getInfoConversations(
        payload.sub,
      );

      for (const conversation of conversations) {
        await client.join(conversation.id);
      }
    } catch (error) {
      console.log(String(error));
      client.emit('exception', String(error));
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
    this.emitConnectedUser();
  }

  emitConnectedUser() {
    const result = new Set(this.connectedUsers.values());

    this.server.emit('connectedUsers', Array.from(result));
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() sendMessageDto: SendMessageDto,
  ) {
    const personId = this.connectedUsers.get(client.id)!;

    await this.messageService.sendMessage(sendMessageDto, personId);

    this.server
      .to(sendMessageDto.conversationId)
      .emit('receive-message', { personId, sendMessageDto });
  }

  @SubscribeMessage('seen-message')
  async handleSeenMessaage(
    @ConnectedSocket() client: Socket,
    @MessageBody() seenMessageDto: SeenMessageDto,
  ) {
    const personId = this.connectedUsers.get(client.id)!;
    await this.messageService.seenMessage(seenMessageDto, personId);

    this.server.to(seenMessageDto.conversationId).emit('seen', {
      personId,
      ...seenMessageDto,
    });
  }
}
