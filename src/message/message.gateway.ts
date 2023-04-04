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
import { SocketUser } from '../user/decorator/user.decorator';
import { GatewayGuard } from '../auth/guards/gateway.guard';
import { MessageService } from './message.service';
import { UserDto } from '../user/dto/user.dto';

dotenv.config();

interface IOnlineUser {
  socketId: string;
  userId: string;
}

@WebSocketGateway({ path: '/chat' })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly _messageService: MessageService,
    private readonly _jwtService: JwtService,
  ) {}

  private _onlineUser: IOnlineUser[] = [];

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

    const onlineUser = {
      socketId,
      userId: user.id,
    };

    this._onlineUser.push(onlineUser);
  }

  handleDisconnect(socket: Socket): void {
    const socketId = socket.id;

    console.log(`Disconnection socket id:`, socketId);

    this._onlineUser = this._onlineUser.filter((i) => i.socketId !== socket.id);
  }

  @UseGuards(GatewayGuard)
  @SubscribeMessage('send-message')
  async sendMessage(@MessageBody() message: CreateMessageDto) {
    try {
      const result = await this._messageService.create(message);

      const socketIdReceiverId = this._onlineUser.find(
        (i) => i.userId === message.receiverId,
      );

      if (!socketIdReceiverId) {
        return;
      }

      this.server.to(socketIdReceiverId.socketId).emit(`message`, message);
    } catch (err) {
      throw new BadGatewayException(
        HttpStatus.BAD_GATEWAY,
        'Unable to send message',
      );
    }
  }
}
