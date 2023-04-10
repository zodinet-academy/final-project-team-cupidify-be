import { MatchedUserProfile } from '../profile/dto/match-user-profile.dto';
import { InjectMapper } from '@automapper/nestjs';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { FindMatchDto } from './dto/find-match.dto';
import { Match } from './entities/match.entity';
import { Mapper } from '@automapper/core';
import { NotiType } from 'src/shared/enums';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { Profile } from 'src/profile/entities/profile.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly _matchRepository: Repository<Match>,
    private _dataSource: DataSource,
    @InjectMapper()
    private readonly _classMapper: Mapper,
    private readonly _notificationGateway: NotificationGateway,
  ) {}

  async create(matchEntity: FindMatchDto) {
    try {
      const matchSave = await this._matchRepository.save({
        ...matchEntity,
        status: false,
      });
      return {
        data: matchSave,
        statusCode: HttpStatus.OK,
        message: 'create success!',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getMatches(
    userId: string,
  ): Promise<THttpResponse<MatchedUserProfile[]>> {
    try {
      const matches = await this._dataSource.manager
        .createQueryBuilder()
        .from(Match, 'match')
        .select('profile')
        .from(Profile, 'profile')
        .where(
          new Brackets((query) => {
            query
              .where('match.userId = :userId', { userId })
              .andWhere('profile.userId = match.matchedId');
          }),
        )
        .orWhere(
          new Brackets((query) => {
            query
              .where('match.matchedId = :userId', { userId })
              .andWhere('profile.userId = match.userId');
          }),
        )
        .andWhere('match.status = true')
        .getMany();

      const data = await this._classMapper.mapArrayAsync(
        matches,
        Profile,
        MatchedUserProfile,
      );

      return {
        statusCode: HttpStatus.OK,
        data,
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(HttpStatus.NOT_FOUND, 'Not Found Matches');
    }
  }

  async getListMacthByID(
    userId: string,
  ): Promise<THttpResponse<FindMatchDto[]>> {
    try {
      const matches = await this._matchRepository.find({ where: { userId } });

      const data = await this._classMapper.mapArrayAsync(
        matches,
        Match,
        FindMatchDto,
      );

      return {
        statusCode: HttpStatus.OK,
        data,
      };
    } catch (err) {
      throw new BadRequestException(HttpStatus.NOT_FOUND, 'Not Found Matches');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} match`;
  }

  async update(match: Match) {
    try {
      const matchUpdate: Match = { ...match, status: !match.status };

      const response = await this._matchRepository.save(matchUpdate);
      return {
        data: response,
        statusCode: HttpStatus.OK,
        message: 'matching!',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(matchDelete: Match) {
    try {
      const response = await this._matchRepository.remove(matchDelete);

      return {
        data: response,
        statusCode: HttpStatus.OK,
        message: 'delete success!',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async checkIsMatch(findMatchDto: FindMatchDto) {
    const { userId, matchedId } = findMatchDto;
    try {
      const response = await this._matchRepository.findOne({
        where: [
          { userId: userId, matchedId: matchedId },
          { userId: matchedId, matchedId: userId },
        ],
      });

      if (!response) {
        return {
          isExist: false,
        };
      }
      return {
        data: response,
        isExist: true,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async match(findMatch: FindMatchDto) {
    const { userId } = findMatch;
    try {
      // Check exist Match
      // False: Create
      // True: Check Is User Created
      const responseIsMatch = await this.checkIsMatch(findMatch);
      if (!responseIsMatch.isExist) {
        return this.create(findMatch);
      }
      const matchFinded = responseIsMatch.data;
      // console.log('match find', matchFinded);
      const isUserCreated = matchFinded.userId === userId;
      // console.log('is created', isUserCreated);
      // If it is user matched updated status
      if (!isUserCreated) {
        this._notificationGateway.create({
          userFromId: matchFinded.userId,
          userToId: matchFinded.matchedId,
          isSeen: false,
          type: NotiType.MATCHING,
        });
        return this.update(matchFinded);
      }
      //No user matched remove
      return this.remove(matchFinded);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
