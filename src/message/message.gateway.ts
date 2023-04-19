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
import { IConversationSocket } from 'src/shared/interfaces/conversation-profile.interface';
import { IOnlineUser } from './interfaces';

dotenv.config();

@WebSocketGateway({
  path: '/chat',
  maxHttpBufferSize: 1e7,
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

  private _onlineUsers: IOnlineUser[] = [];

  @WebSocketServer() server;
  handleConnection(socket: Socket): void {
    try {
      const socketId = socket.id;

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

      const isExistUser = this._onlineUsers.find(
        (userOnline) => userOnline.userId === user.id,
      );
      if (isExistUser) return;

      const socketUser = {
        socketId,
        userId: user.id,
      };

      this._onlineUsers.push(socketUser);
    } catch (error) {
      socket.disconnect(true);
    }
  }

  handleDisconnect(socket: Socket): void {
    const socketId = socket.id;

    this._onlineUsers = this._onlineUsers.filter(
      (i) => i.socketId !== socketId,
    );
  }

  @UseGuards(GatewayGuard)
  @SubscribeMessage('send-message')
  async sendMessage(@MessageBody() message: CreateMessageDto) {
    try {
      let result;
      if (message.type === MessageType.TEXT) {
        result = await this._messageService.create(null, message);
      }
      // Find user receiver
      const socketIdReceiverId = this._onlineUsers.find(
        (i) => i.userId === message.receiverId,
      );

      if (!socketIdReceiverId) return;

      this.server
        .to(socketIdReceiverId.socketId)
        .emit(`receive-message`, message);

      return result;
    } catch (err) {
      throw new BadGatewayException(
        HttpStatus.BAD_GATEWAY,
        'Unable to send message',
      );
    }
  }

  @SubscribeMessage('create-conversation')
  async sendConversation(@MessageBody() sendConversation: IConversationSocket) {
    try {
      const socketIdReceiverId = this._onlineUsers.find(
        (i) => i.userId === sendConversation.sendUserId,
      );

      const conversation = {
        conversationId: sendConversation.conversationId,
        userProfile: {
          userId: sendConversation.userProfile.userId,
          name: sendConversation.userProfile.name,
          avatar: sendConversation.userProfile.avatar,
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
