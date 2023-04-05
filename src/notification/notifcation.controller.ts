import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/user/decorator/user.decorator';
import { UserDto } from 'src/user/dto/user.dto';
import { NotificationService } from './notification.service';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly _notificationService: NotificationService) {}

  @ApiOkResponse({
    description: 'Get profile succesfully',
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get()
  getNotifications(@User() user: UserDto) {
    return this._notificationService.totalNotificationByUser(user.id);
  }

  @ApiOkResponse({
    description: 'Update notification sucessfully!',
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Put()
  updateRead(@Body() updateNotiDto) {
    return this._notificationService.updateNotiRead(updateNotiDto);
  }
}
