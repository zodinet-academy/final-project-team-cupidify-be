import { HttpStatus, UseGuards } from '@nestjs/common';
import { NotificationDto } from './dto/notification.dto';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Server, Socket } from 'socket.io';
import { WsGuard } from '../auth/guards/ws.guard';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { Notification } from './entities/notification.entity';

dotenv.config();

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly _notificationService: NotificationService) {}

  @SubscribeMessage('createNotification')
  async create(
    @MessageBody() createNotificationDto: CreateNotificationDto,
  ): Promise<THttpResponse<NotificationDto>> {
    const notification = await this._notificationService.create(
      createNotificationDto,
    );

    this.server.emit(`noti-${notification.userFromId}`, notification);
    this.server.emit(`noti-${notification.userToId}`, notification);

    return {
      statusCode: HttpStatus.OK,
      message: 'Hello',
      data: notification,
    };
  }

  @SubscribeMessage('findAllNotification')
  // @UseGuards(WsGuard)
  async findAll(socket: Socket): Promise<THttpResponse<Notification[]>> {
    let token = socket.handshake.headers.authorization;
    token = token.split(' ')[1];

    const jwt = new JwtService();
    const { id: userId } = jwt.verify(token, {
      secret: process.env.SECRET_KEY,
    });

    const notification =
      await this._notificationService.totalNotificationByUser(userId);
    // console.log('notis:   ', notification);

    return notification;
  }

  @SubscribeMessage('findOneNotification')
  findOne(@MessageBody() id: number) {
    return this._notificationService.findOne(id);
  }

  @SubscribeMessage('updateNotification')
  update(@MessageBody() updateNotificationDto: UpdateNotificationDto) {
    return this._notificationService.update(
      updateNotificationDto.id,
      updateNotificationDto,
    );
  }

  @SubscribeMessage('removeNotification')
  remove(@MessageBody() id: number) {
    return this._notificationService.remove(id);
  }
}
