import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageGateway, MessageProfile],
  exports: [MessageGateway, MessageService],
})
export class MessageModule {}
