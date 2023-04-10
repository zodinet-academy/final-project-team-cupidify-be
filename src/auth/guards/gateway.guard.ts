import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

@Injectable()
export class GatewayGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const socket = context.switchToWs().getClient();
    const token = socket.handshake.query.token;
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      socket.data.user = decoded;
      return true;
    } catch (err) {
      socket.disconnect(true);
      return false;
    }
  }
}
