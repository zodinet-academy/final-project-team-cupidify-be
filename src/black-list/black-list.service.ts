import { BlackListDto } from './dto/black-list.dto';
import { THttpResponse } from './../shared/common/http-response.dto';
import { BlackList } from './entities/black-list.entity';
import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class BlackListService {
  constructor(
    @InjectRepository(BlackList)
    private readonly _blackList: Repository<BlackList>,
    @InjectMapper() private readonly _classMapper: Mapper,
  ) {}

  async addBlockedUser(
    userId: string,
    blockedId: string,
  ): Promise<THttpResponse<void>> {
    try {
      const result = await this._blackList.save({ userId, blockedId });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Created',
      };
    } catch (err) {
      throw new BadRequestException(
        HttpStatus.BAD_REQUEST,
        'Add blocked user failed',
      );
    }
  }

  async getBlockedUser(userId: string): Promise<THttpResponse<BlackListDto[]>> {
    try {
      const res = await this._blackList.find({ where: { userId } });

      const result = await this._classMapper.mapArrayAsync(
        res,
        BlackList,
        BlackListDto,
      );

      return {
        statusCode: HttpStatus.OK,
        data: result,
      };
    } catch (err) {
      throw new BadRequestException(
        HttpStatus.NOT_FOUND,
        'Not Found Blocked Users',
      );
    }
  }
}
