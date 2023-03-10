import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './notification/notification.module';
import { BlackListModule } from './black-list/black-list.module';

@Module({
  imports: [NotificationModule, BlackListModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
