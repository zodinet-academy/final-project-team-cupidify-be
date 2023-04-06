import { MatchedUserProfile } from '../profile/dto/match-user-profile.dto';
import { InjectMapper } from '@automapper/nestjs';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import {
  Injectable,
  BadRequestException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { FindMatchDto } from './dto/find-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match } from './entities/match.entity';
import { Mapper } from '@automapper/core';
import { User } from 'src/user/entities/user.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { DeleteMatchDto } from './dto/delete-match.dto';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly _matchRepository: Repository<Match>,
    private _dataSource: DataSource,
    @InjectMapper()
    private readonly _classMapper: Mapper,
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

      console.log('Result: ', matches);

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

  async removeMatch(userId: string, matchedId: string) {
    try {
      const result = await this._matchRepository.findOne({
        where: [
          {
            userId,
            matchedId,
            status: true,
          },
          {
            userId: matchedId,
            matchedId: userId,
            status: true,
          },
        ],
      });

      await this._matchRepository.delete({
        userId: result.userId,
        matchedId: result.matchedId,
      });
    } catch (err) {
      throw new BadRequestException('Not Found Match');
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

  async deleteMatch(userId: string, matchedId: string) {
    try {
      const result = await this._matchRepository.delete({
        userId,
        matchedId,
        status: true,
      });
    } catch (err) {
      console.log(err.message);
      throw new BadRequestException('Unable to delete match');
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
      const isUserCreated = matchFinded.userId === userId;
      // If it is user matched updated status
      if (!isUserCreated) {
        return this.update(matchFinded);
      }
      //Not user matched remove
      return this.remove(matchFinded);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
