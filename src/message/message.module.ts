import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { Message } from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageProfile } from './message.profile';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), CloudinaryModule],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway, MessageProfile],
})
export class MessageModule {}
