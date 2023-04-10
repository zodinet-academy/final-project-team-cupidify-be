import { BlackListDto } from './dto/black-list.dto';
import { THttpResponse } from './../shared/common/http-response.dto';
import { BlackList } from './entities/black-list.entity';
import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { AddBlockedUserDto } from './dto/add-blocked-user.dto';
import { MatchService } from '../match/match.service';

@Injectable()
export class BlackListService {
  constructor(
    @InjectRepository(BlackList)
    private readonly _blackList: Repository<BlackList>,
    @InjectMapper() private readonly _classMapper: Mapper,
    private readonly _matchService: MatchService,
  ) {}

  async addBlockedUser(
    userId: string,
    addBlockUser: AddBlockedUserDto,
  ): Promise<THttpResponse<{ id: string }>> {
    try {
      addBlockUser.userId = userId;

      const resource = this._classMapper.map(
        addBlockUser,
        AddBlockedUserDto,
        BlackList,
      );

      const result = await this._blackList.save(resource);

      return {
        statusCode: HttpStatus.CREATED,
        data: {
          id: result.id,
        },
      };
    } catch (err) {
      console.log(err.message);
      throw new BadRequestException(
        HttpStatus.BAD_REQUEST,
        'Add blocked user failed',
      );
    }
  }

  async blockUser(
    userId: string,
    blockedId: string,
  ): Promise<THttpResponse<void>> {
    try {
      const affectedResult = await this._matchService.removeMatch(
        userId,
        blockedId,
      );

      if (affectedResult === 0) {
        throw new BadRequestException('Not Found Match');
      }

      const result = await this._blackList.save({
        userId,
        blockedId,
      });

      if (!result.id) {
        throw new BadRequestException('Unable to add blocked user');
      }

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Added blocked user',
      };
    } catch (err) {
      throw new BadRequestException('Error in blocking');
    }
  }

  async getBlockedUser(
    userId: string,
  ): Promise<
    THttpResponse<{ sourceUsers: BlackListDto[]; targetUsers: BlackListDto[] }>
  > {
    try {
      const res = await this._blackList.find({
        where: [{ userId }, { blockedId: userId }],
      });

      const sourceUsers = await this._classMapper.mapArrayAsync(
        res.filter((u) => u.userId === userId),
        BlackList,
        BlackListDto,
      );

      const targetUsers = await this._classMapper.mapArrayAsync(
        res.filter((u) => u.blockedId === userId),
        BlackList,
        BlackListDto,
      );

      return {
        statusCode: HttpStatus.OK,
        data: {
          sourceUsers,
          targetUsers,
        },
      };
    } catch (err) {
      throw new BadRequestException(
        HttpStatus.NOT_FOUND,
        'Not Found Blocked Users',
      );
    }
  }
}
