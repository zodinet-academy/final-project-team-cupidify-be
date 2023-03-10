import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';

import { NotificationModule } from './notification/notification.module';
import { BlackListModule } from './black-list/black-list.module';
import { MatchModule } from './match/match.module';
@Module({
  imports: [UserModule, ProfileModule,NotificationModule, BlackListModule, MatchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
