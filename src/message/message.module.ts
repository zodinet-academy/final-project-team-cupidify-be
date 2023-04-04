import { Message } from './entities/message.entity';
import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationModule } from 'src/conversation/conversation.module';
import { MessageGateway } from './message.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), ConversationModule, JwtModule],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
})
export class MessageModule {}
