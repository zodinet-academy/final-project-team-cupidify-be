import { Conversation } from './entities/conversation.entity';
import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { ConversationProfile } from './conversation.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchModule } from '../match/match.module';
import { ProfileModule } from 'src/profile/profile.module';
import { ProfileProfile } from 'src/profile/profile.profile';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation]),
    MatchModule,
    ProfileModule,
    MessageModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationProfile, ProfileProfile],
  exports: [ConversationService],
})
export class ConversationModule {}
