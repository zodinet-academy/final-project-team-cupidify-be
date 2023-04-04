import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDto } from './dto/message-dto';
import { MessageService } from './message.service';

@WebSocketGateway()
export class MessageGateway {
  constructor(private readonly _messageService: MessageService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(
    client: Socket,
    payload: CreateMessageDto,
  ): Promise<THttpResponse<MessageDto>> {
    return this._messageService.sendMessage(this.server, payload);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    // const messages = await this.chatService.getMessages(room);
    // client.emit('messages', messages);
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
