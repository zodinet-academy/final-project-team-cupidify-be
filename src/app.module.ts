import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';

import { NotificationModule } from './notification/notification.module';

import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { MatchModule } from './match/match.module';
import { BlackListModule } from './black-list/black-list.module';
import { PhotoModule } from './photo/photo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [],
        // entities: ['src/**/entities/*.entity{.ts,.js}'],
        // autoLoadEntities: true,
      }),
    }),
    UserModule,
    ProfileModule,
    NotificationModule,
    BlackListModule,
    MatchModule,
    ConversationModule,
    MessageModule,
    PhotoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
