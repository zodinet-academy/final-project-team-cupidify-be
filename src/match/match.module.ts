import { ProfileModule } from '../profile/profile.module';
import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { MatchProfile } from './match.profile';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    NotificationModule,
    ProfileModule,
  ],
  controllers: [MatchController],
  providers: [MatchService, MatchProfile],
  exports: [MatchService],
})
export class MatchModule {}
