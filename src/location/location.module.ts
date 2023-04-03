import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { ProfileModule } from '../profile/profile.module';
import { BlackListModule } from '../black-list/black-list.module';
import { MatchModule } from '../match/match.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location]),
    ProfileModule,
    MatchModule,
    BlackListModule,
  ],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
