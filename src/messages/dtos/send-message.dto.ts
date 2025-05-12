import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';
import { UUID } from 'crypto';

export class SendMessageDto {
  @ApiProperty({
    type: 'string',
  })
  @IsUUID()
  @IsNotEmpty()
  conversationId: UUID;

  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  message: string;
}
