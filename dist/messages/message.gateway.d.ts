import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auths/auth.service';
import { UUID } from 'crypto';
import { MessageService } from './message.service';
import { SendMessageDto } from './dtos/send-message.dto';
import { SeenMessageDto } from './dtos/seen-message.dto';
export declare class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly authService;
    private readonly messageService;
    server: Server;
    connectedUsers: Map<string, UUID>;
    constructor(authService: AuthService, messageService: MessageService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    emitConnectedUser(): void;
    handleMessage(client: Socket, sendMessageDto: SendMessageDto): Promise<void>;
    handleSeenMessaage(client: Socket, seenMessageDto: SeenMessageDto): Promise<void>;
}
