import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService, ConversationProfile, ProfileProfile],
  exports: [ConversationService],
})
export class ConversationModule {}
