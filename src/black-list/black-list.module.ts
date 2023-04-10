import { UserModule } from './../user/user.module';
import { BlackList } from './entities/black-list.entity';
import { Module } from '@nestjs/common';
import { BlackListService } from './black-list.service';
import { BlackListController } from './black-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlackListProfile } from './black-list.profile';
import { MatchModule } from 'src/match/match.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlackList]), UserModule, MatchModule],
  controllers: [BlackListController],
  providers: [BlackListService, BlackListProfile],
  exports: [BlackListService],
})
export class BlackListModule {}
