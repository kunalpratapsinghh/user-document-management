import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { OcrService } from '../ocr/ocr.service';

@Processor('document-upload')
export class BullQueueProcessor {
  constructor(private readonly ocrService: OcrService) {}

  @Process('processDocument')
  async handleDocumentJob(job: Job<{
    documentId: any; _id: string 
}>) {
    const documentId = job.data.documentId;
    await this.ocrService.processDocument(documentId);
  }
}
