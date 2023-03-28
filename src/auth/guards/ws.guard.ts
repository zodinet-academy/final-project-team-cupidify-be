import { Injectable, CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private userService: UserService) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];
    try {
      const jwt = new JwtService();
      const decoded = jwt.verify(bearerToken, {
        secret: process.env.SECRET_KEY,
      }) as any;
      return new Promise((resolve, reject) => {
        return this.userService.findById(decoded.id).then((user) => {
          if (user) {
            resolve(user);
          } else {
            reject(false);
          }
        });
      });
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}
