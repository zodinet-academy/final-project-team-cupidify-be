import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/profile/entities/profile.entity';
import { ProfileService } from 'src/profile/profile.service';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import { LIMIT_NOTI_RESULTS } from 'src/shared/constants/constants';
import { NotiType } from 'src/shared/enums';
import { Brackets, DataSource, LessThan, Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FindNotiDto } from './dto/find-notification.dto';
import { NotificationDto } from './dto/notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly _notificationRepository: Repository<Notification>,
    private _dataSource: DataSource,
    @InjectMapper() private readonly _classMapper: Mapper,
    private readonly _profileService: ProfileService,
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

    const [fromProfileRes, toProfileRes] = await Promise.all([
      this._profileService.findOneByUserId(notification.userFromId),
      this._profileService.findOneByUserId(notification.userToId),
    ]);

    const fromProfile = fromProfileRes.data;
    const toProfile = toProfileRes.data;

    const transformedNoti = {
      id: notification.id,
      createdAt: notification.createdAt,
      isSeen: notification.isSeen,
      type: notification.type,
      userFromId: fromProfile.userId,
      userToId: toProfile.userId,
      fromUserName: fromProfile.name,
      toUserName: toProfile.name,
      fromAvatar: fromProfile.avatar,
      toAvatar: toProfile.avatar,
    };

    return transformedNoti;
  }

  async updateNotiRead(updateNotiDto) {
    try {
      await this._notificationRepository.update(
        { id: updateNotiDto.notiId },
        { isSeen: true },
      );
      return {
        statusCode: HttpStatus.OK,
        data: {
          notiId: updateNotiDto.notiId,
        },
      };
    } catch (err) {
      throw new BadRequestException(HttpStatus.BAD_REQUEST, err.message);
    }
  }

  async markAllRead(userId: string) {
    try {
      const allNotis = await this._notificationRepository.find({
        where: [
          { userFromId: userId, type: NotiType.MATCHING },
          { userToId: userId, type: NotiType.MATCHING },
          { type: NotiType.LIKED, userToId: userId },
        ],
      });

      allNotis.forEach((noti) => {
        this.updateNotiRead({ notiId: noti.id });
      });
    } catch (err) {
      throw new BadRequestException(HttpStatus.BAD_REQUEST, err.message);
    }
  }

  async totalNotificationByUser(userId: string, findNotiDto: FindNotiDto) {
    const { lastNotiId } = findNotiDto;
    try {
      let result;
      let total;
      if (!lastNotiId) {
        [result, total] = await this._notificationRepository.findAndCount({
          where: [
            { userFromId: userId, type: NotiType.MATCHING },
            { userToId: userId, type: NotiType.MATCHING },
            { userToId: userId, type: NotiType.LIKED },
          ],
          order: { createdAt: 'DESC' },
          take: LIMIT_NOTI_RESULTS,
        });
      } else {
        const lastNoti = await this._notificationRepository.findOne({
          where: { id: lastNotiId },
        });

        const resultPro = this._notificationRepository.find({
          where: [
            {
              userFromId: userId,
              type: NotiType.MATCHING,
              createdAt: LessThan(lastNoti.createdAt),
            },
            {
              userToId: userId,
              type: NotiType.MATCHING,
              createdAt: LessThan(lastNoti.createdAt),
            },
            {
              userToId: userId,
              type: NotiType.LIKED,
              createdAt: LessThan(lastNoti.createdAt),
            },
          ],
          order: { createdAt: 'DESC' },
          take: LIMIT_NOTI_RESULTS,
        });

        const totalPro = this._notificationRepository.count({
          where: [
            {
              userFromId: userId,
              type: NotiType.MATCHING,
            },
            {
              userToId: userId,
              type: NotiType.MATCHING,
            },
            {
              userToId: userId,
              type: NotiType.LIKED,
            },
          ],
        });

        [result, total] = await Promise.all([resultPro, totalPro]);
      }

      const unreadNotis = await this._notificationRepository.find({
        where: [
          { userFromId: userId, type: NotiType.MATCHING, isSeen: false },
          { userToId: userId, type: NotiType.MATCHING, isSeen: false },
          { userToId: userId, type: NotiType.LIKED, isSeen: false },
        ],
      });

      const totalPages = Math.ceil(total / LIMIT_NOTI_RESULTS);

      const notis = result.map(async (noti) => {
        const [fromProfileRes, toProfileRes] = await Promise.all([
          this._profileService.findOneByUserId(noti.userFromId),
          this._profileService.findOneByUserId(noti.userToId),
        ]);

        const fromProfile = fromProfileRes.data;
        const toProfile = toProfileRes.data;

        return {
          id: noti.id,
          createdAt: noti.createdAt,
          isSeen: noti.isSeen,
          type: noti.type,
          userFromId: fromProfile.userId,
          userToId: toProfile.userId,
          fromUserName: fromProfile.name,
          toUserName: toProfile.name,
          fromAvatar: fromProfile.avatar,
          toAvatar: toProfile.avatar,
        };
      });
      const noti = await Promise.all(notis);

      return {
        statusCode: HttpStatus.OK,
        data: { noti, totalPages, unreadNotis: unreadNotis.length },
      };
    } catch (err) {
      throw new BadRequestException(HttpStatus.BAD_REQUEST, err.message);
    }
  }
}
