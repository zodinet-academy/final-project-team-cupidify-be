import { join } from 'path';
import { CreateMessageDto } from './dto/create-message.dto';
import { BadGatewayException, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
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

@WebSocketGateway()
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

    const socketUser = {
      socketId,
      userId: user.id,
    };

    this._online.push(socketUser);
  }

  handleDisconnect(socket: Socket): void {
    const socketId = socket.id;

    console.log(`Disconnection socket id:`, socketId);

    this._online = this._online.filter((i) => i.socketId !== socket.id);
  }

  @UseGuards(GatewayGuard)
  @SubscribeMessage('send-message')
  async sendMessage(@MessageBody() message: CreateMessageDto) {
    try {
      const socketIdReceiverId = this._online.find(
        (i) => i.userId === message.receiverId,
      );

      this.server.to(socketIdReceiverId.socketId).emit(`message`, message);

      const result = await this._messageService.create(message);
    } catch (err) {
      throw new BadGatewayException(
        HttpStatus.BAD_GATEWAY,
        'Unable to send message',
      );
    }
  }
}
