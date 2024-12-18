import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class BullQueueService {
  constructor(@InjectQueue('document-upload')
  private readonly documentQueue: Queue) { }

  async sendMessageToQueue(documentId: string) {
    const response = await this.documentQueue.add('processDocument', { documentId });
    return response
  }
}
