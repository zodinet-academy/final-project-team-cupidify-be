import { HttpStatus } from '@nestjs/common';
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
import { Server } from 'socket.io';
import { User } from 'src/user/decorator/user.decorator';

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly _notificationService: NotificationService) {}

  @SubscribeMessage('createNotification')
  async create(
    @MessageBody() createNotificationDto: CreateNotificationDto,
  ): Promise<THttpResponse<NotificationDto>> {
    console.log('Create notification');
    const notification = await this._notificationService.create(
      createNotificationDto,
    );

    this.server.emit('testNotification', 'Hello World');

    this.server.emit(`noti-${notification.userFromId}`, notification);
    this.server.emit(`noti-${notification.userToId}`, notification);

    return {
      statusCode: HttpStatus.OK,
      message: 'Hello',
      data: notification,
    };
  }

  @SubscribeMessage('findAllNotification')
  findAll(@User() user) {
    return this._notificationService.totalNotificationByUser(user.id);
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
