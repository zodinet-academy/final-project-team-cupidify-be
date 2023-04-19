import { HttpStatus } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Server, Socket } from 'socket.io';
import * as dotenv from 'dotenv';
import { NotiType } from 'src/shared/enums';

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
  async create(@MessageBody() createNotificationDto: CreateNotificationDto) {
    const notification = await this._notificationService.create(
      createNotificationDto,
    );

    if (notification.type === NotiType.LIKED) {
      this.server.emit(`noti-${notification.userToId}`, notification);
    }

    if (notification.type === NotiType.MATCHING) {
      this.server.emit(`noti-${notification.userFromId}`, notification);
      this.server.emit(`noti-${notification.userToId}`, notification);
    }

    console.log('socket match: ', notification);

    return {
      statusCode: HttpStatus.OK,
      message: 'Hello',
      data: notification,
    };
  }

  @SubscribeMessage('test')
  test(client: Socket) {
    this.server.to(client.id).emit('test', 'hello');
  }
}
