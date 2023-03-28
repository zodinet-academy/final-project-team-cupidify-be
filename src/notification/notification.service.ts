import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationDto } from './dto/notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
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
    console.log('noti', toSaveNoti);
    const notification = this._classMapper.mapAsync(
      await this._notificationRepository.save(toSaveNoti),
      Notification,
      NotificationDto,
    );

    // const notification = await this._notificationRepository.save(
    //   createNotificationDto,
    // );

    return notification;
  }

  async totalNotificationByUser(userId: string): Promise<void> {
    try {
      const result = await this._notificationRepository.findAndCount({
        where: [{ userFromId: userId }, { userToId: userId }],
      });

      // console.log('Notification count: ', result);
    } catch (err) {
      throw new BadRequestException(HttpStatus.BAD_REQUEST, err.message);
    }
  }

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
