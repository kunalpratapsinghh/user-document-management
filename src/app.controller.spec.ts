import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockAppService = {
    getHello: jest.fn().mockReturnValue('Hello Mocked World!'),
    getAnotherMessage: jest.fn().mockReturnValue('Another Message'),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return "Hello Mocked World!"', () => {
      expect(appController.getHello()).toBe('Hello Mocked World!');
      expect(mockAppService.getHello).toHaveBeenCalled();
    });
  });

  describe('getAnotherMessage', () => {
    it('should return "Another Message"', () => {
      mockAppService.getAnotherMessage.mockReturnValue('Another Message');
      const result = appService.getAnotherMessage();
      expect(result).toBe('Another Message');
      expect(mockAppService.getAnotherMessage).toHaveBeenCalled();
    });
  });
});
