import { Test, TestingModule } from '@nestjs/testing';
import { BullQueueProcessor } from './bull-queue.processor';
import { OcrService } from '../ocr/ocr.service';
import { Job } from 'bull';

describe('BullQueueProcessor', () => {
  let bullQueueProcessor: BullQueueProcessor;
  let mockOcrService: OcrService;

  beforeEach(async () => {
    mockOcrService = { processDocument: jest.fn() } as unknown as OcrService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BullQueueProcessor,
        {
          provide: OcrService,
          useValue: mockOcrService,
        },
      ],
    }).compile();

    bullQueueProcessor = module.get<BullQueueProcessor>(BullQueueProcessor);
  });

  it('should process document job', async () => {
    const documentId = 'doc123';
    const job = { data: { documentId } } as Job;
    await bullQueueProcessor.handleDocumentJob(job);
    expect(mockOcrService.processDocument).toHaveBeenCalledWith(documentId);
  });
});
