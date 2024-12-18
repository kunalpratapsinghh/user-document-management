import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BullQueueService } from './bull-queue.service';
import { BullQueueProcessor } from './bull-queue.processor';
import { OcrModule } from 'src/ocr/ocr.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'document-upload',
      redis: {
        host: 'localhost', 
        port: 6379,        
     }
    }),
    OcrModule
  ],
  providers: [BullQueueService, BullQueueProcessor],
  exports: [BullQueueService],
})
export class BullQueueModule {}
