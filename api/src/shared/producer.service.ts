import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { rabbitMQConfig } from './rabbitmq.options';

@Injectable()
export class ProducerService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create(rabbitMQConfig());
  }

  async sendMessage(pattern: string, data: any) {
    try {
      return await this.client.emit(pattern, data).toPromise();
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }
}