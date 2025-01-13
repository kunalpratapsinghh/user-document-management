import { Test, TestingModule } from '@nestjs/testing';
import { BullQueueService } from './bull-queue.service';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';

describe('BullQueueService', () => {
  let bullQueueService: BullQueueService;
  let mockQueue: Queue;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn().mockResolvedValue('job added'),
    } as unknown as Queue;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BullQueueService,
        {
          provide: getQueueToken('document-upload'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    bullQueueService = module.get<BullQueueService>(BullQueueService);
  });

  it('should send a message to the queue', async () => {
    const documentId = 'doc123';

    const result = await bullQueueService.sendMessageToQueue(documentId);

    expect(mockQueue.add).toHaveBeenCalledWith('processDocument', { documentId });
    expect(result).toBe('job added');
  });
});
