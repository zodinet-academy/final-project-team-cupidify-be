import { Message } from './entities/message.entity';
import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageProfile } from './message.profile';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), CloudinaryModule, JwtModule],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway, MessageProfile],
  exports: [MessageGateway, MessageService],
})
export class MessageModule {}
