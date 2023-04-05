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

dotenv.config();

@WebSocketGateway({ path: '/chat' })
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

      this.server.to(socketIdReceiverId.socketId).emit(`message`, message);

      // const result = await this._messageService.create(file, message);
    } catch (err) {
      throw new BadGatewayException(
        HttpStatus.BAD_GATEWAY,
        'Unable to send message',
      );
    }
  }
}
