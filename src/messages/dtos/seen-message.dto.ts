import { IsNotEmpty, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class SeenMessageDto {
  @IsUUID()
  @IsNotEmpty()
  messageId: UUID;

  @IsUUID()
  @IsNotEmpty()
  conversationId: UUID;
}
