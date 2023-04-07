import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationProfile } from './notification.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UserModule } from 'src/user/user.module';
import { NotificationController } from './notifcation.controller';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    UserModule,
    ProfileModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationGateway, NotificationService, NotificationProfile],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
