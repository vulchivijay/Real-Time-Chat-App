import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    // send history on connect
    client.emit('history', this.chatService.getHistory());
  }

  handleDisconnect(client: Socket) {
    // no-op for MVP
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { username: string; text: string }) {
    const msg = this.chatService.addMessage({ username: payload.username, text: payload.text });
    this.server.emit('message', msg);
    return { status: 'ok' };
  }
}
