import { Injectable } from '@nestjs/common';
import { ChatMessage } from './messages.interface';

@Injectable()
export class ChatService {
  private messages: ChatMessage[] = [];

  getHistory(): ChatMessage[] {
    return this.messages.slice(-200);
  }

  addMessage(payload: { username: string; text: string }): ChatMessage {
    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      username: payload.username,
      text: payload.text,
      ts: Date.now(),
    };
    this.messages.push(msg);
    return msg;
  }
}
