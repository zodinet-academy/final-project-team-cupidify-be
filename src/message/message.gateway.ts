import { CreateMessageDto } from './dto/create-message.dto';
import { BadGatewayException, HttpStatus, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { GatewayGuard } from '../auth/guards/gateway.guard';
import { MessageService } from './message.service';
import { MessageType } from 'src/shared/enums';
import { MessageDto } from './dto/message-dto';
import { ConversationDto } from '../conversation/dto/conversation.dto';

dotenv.config();

@WebSocketGateway({
  path: '/chat',
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly _messageService: MessageService,
    private readonly _jwtService: JwtService,
  ) {}

  private _online: any = [];

  @WebSocketServer() server;
  handleConnection(socket: Socket): void {
    const socketId = socket.id;

    console.log(`New connecting socket id:`, socketId);

    const token: any = socket.handshake.query['token'];
    if (!token) {
      throw new BadGatewayException(
        HttpStatus.UNAUTHORIZED,
        'No Token Provided',
      );
    }
    const user = this._jwtService.verify(token, {
      secret: process.env.SECRET_KEY,
    });

    if (!user) {
      throw new BadGatewayException(HttpStatus.UNAUTHORIZED, 'Invalid Token');
    }

    const isExistUser = this._online.find(
      (userOnline) => userOnline.id === user.id,
    );
    if (isExistUser) return;

    const socketUser = {
      socketId,
      userId: user.id,
    };

    this._online.push(socketUser);
    console.log('current online', this._online);
  }

  handleDisconnect(socket: Socket): void {
    const socketId = socket.id;

    console.log(`Disconnection socket id:`, socketId);

    this._online = this._online.filter((i) => i.socketId !== socket.id);

    console.log(this._online);
  }

  @UseGuards(GatewayGuard)
  @SubscribeMessage('send-message')
  async sendMessage(
    @MessageBody() message: CreateMessageDto,
    // @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const socketIdReceiverId = this._online.find(
        (i) => i.userId === message.receiverId,
      );

      this.server
        .to(socketIdReceiverId.socketId)
        .emit(`receive-message`, message);

      if (message.type === MessageType.IMAGE) return;
      const result = await this._messageService.create(null, message);
      return result;
    } catch (err) {
      throw new BadGatewayException(
        HttpStatus.BAD_GATEWAY,
        'Unable to send message',
      );
    }
  }

  @SubscribeMessage('send-message')
  async sendConversation(@MessageBody() sendConversation: any) {
    console.log('sendConversation: ', sendConversation);

    try {
      const socketIdReceiverId = this._online.find(
        (i) => i.userId === sendConversation.conversation.userToId,
      );

      const conversation = {
        conversationId: sendConversation.conversation.conversationId,
        userProfile: {
          userId: sendConversation.profile.userId,
          name: sendConversation.profile.name,
          avatar: sendConversation.profile.avatar,
        },
      };
      this.server
        .to(socketIdReceiverId.socketId)
        .emit(`create-conversation`, conversation);
    } catch (err) {
      throw new BadGatewayException(
        HttpStatus.BAD_GATEWAY,
        'Unable to send message',
      );
    }
  }
}
