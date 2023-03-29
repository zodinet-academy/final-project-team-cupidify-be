import { ProfileModule } from '../profile/profile.module';
import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { MatchProfile } from './match.profile';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), ProfileModule],
  controllers: [MatchController],
  providers: [MatchService, MatchProfile],
})
export class MatchModule {}
