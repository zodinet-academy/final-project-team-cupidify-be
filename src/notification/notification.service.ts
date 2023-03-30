import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationDto } from './dto/notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly _notificationRepository: Repository<Notification>,
    @InjectMapper() private readonly _classMapper: Mapper,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const toSaveNoti = this._classMapper.map(
      createNotificationDto,
      CreateNotificationDto,
      Notification,
    );

    const notification = await this._classMapper.mapAsync(
      await this._notificationRepository.save(toSaveNoti),
      Notification,
      NotificationDto,
    );

    // this.server.emit(`noti-${notification.userFromId}`, notification);
    // this.server.emit(`noti-${notification.userToId}`, notification);

    // const notification = await this._notificationRepository.save(
    //   createNotificationDto,
    // );

    return notification;
  }

  async totalNotificationByUser(
    userId: string,
  ): Promise<THttpResponse<Notification[]>> {
    try {
      const result = await this._notificationRepository.find({
        where: [{ userFromId: userId }, { userToId: userId }],
      });

      // console.log('Notification count: ', result);
      return {
        statusCode: HttpStatus.OK,
        data: result,
      };
    } catch (err) {
      throw new BadRequestException(HttpStatus.BAD_REQUEST, err.message);
    }
  }
}
