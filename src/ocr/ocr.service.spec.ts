import { Test, TestingModule } from '@nestjs/testing';
import { OcrService } from './ocr.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserDocument } from '../document/document.schema';
import * as tesseract from 'tesseract.js';

describe('OcrService', () => {
  let ocrService: OcrService;
  let mockDocumentModel: any;

  beforeEach(async () => {
    mockDocumentModel = {
      findById: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OcrService,
        {
          provide: getModelToken(UserDocument.name),
          useValue: mockDocumentModel,
        },
      ],
    }).compile();

    ocrService = module.get<OcrService>(OcrService);
  });

  it('should process the document and save the OCR result', async () => {
    const documentId = 'document123';
    const mockDocument = {
      _id: documentId,
      content: 'base64encodedcontent',
      details: {},
      save: jest.fn(),
    };

    const ocrResult = {
      jobId: 'someJobId',
      data: {
        text: 'Recognized OCR Text',
        ...Object()
      },
    };

    mockDocumentModel.findById.mockResolvedValue(mockDocument);
    jest.spyOn(tesseract, 'recognize').mockResolvedValue(ocrResult);

    await ocrService.processDocument(documentId);

    expect(mockDocumentModel.findById).toHaveBeenCalledWith(documentId);
    expect(tesseract.recognize).toHaveBeenCalledWith(Buffer.from(mockDocument.content, 'base64'), 'eng');
    expect(mockDocument.details).toEqual({ ocrText: 'Recognized OCR Text' });
    expect(mockDocument.save).toHaveBeenCalled();
  });

  it('should throw an error if the document is not found', async () => {
    const documentId = 'nonexistentDoc';

    mockDocumentModel.findById.mockResolvedValue(null);

    await expect(ocrService.processDocument(documentId)).rejects.toThrowError(`Document with ID ${documentId} not found`);
  });
});
