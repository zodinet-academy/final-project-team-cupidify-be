import { CreateMessageDto } from './dto/create-message.dto';
import {
  BadGatewayException,
  BadRequestException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
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
    try {
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
    } catch (error) {
      // console.log(error.message);
      // throw new BadRequestException(
      //   HttpStatus.UNAUTHORIZED,
      //   'No token provided!',
      // );
      socket.disconnect(true);
    }
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
      let result;
      if (message.type === MessageType.TEXT) {
        result = await this._messageService.create(null, message);
      }
      // Find user receiver
      const socketIdReceiverId = this._online.find(
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
      const socketIdReceiverId = this._online.find(
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
