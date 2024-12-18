import { Injectable } from '@nestjs/common';
import * as tesseract from 'tesseract.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../document/document.schema';

@Injectable()
export class OcrService {
  constructor(@InjectModel(UserDocument.name)
  private documentModel: Model<UserDocument>) { }

  async processDocument(documentId: string) {
    const document = await this.documentModel.findById(documentId);
    if (!document) {
      throw new Error(`Document with ID ${documentId} not found`);
    }
    const ocrResult = await tesseract.recognize(Buffer.from(document.content, 'base64'), 'eng');
    document.details = { ocrText: ocrResult.data.text };
    await document.save();
    console.log('Document updated with OCR details:', documentId);
  }
}
