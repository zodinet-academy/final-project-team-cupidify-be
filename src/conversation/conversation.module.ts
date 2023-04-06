import { Conversation } from './entities/conversation.entity';
import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { ConversationProfile } from './conversation.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchModule } from '../match/match.module';
import { ProfileModule } from 'src/profile/profile.module';
import { ProfileProfile } from 'src/profile/profile.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation]),
    MatchModule,
    ProfileModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationProfile, ProfileProfile],
})
export class ConversationModule {}
