import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserDocumentSchema } from '../document/document.schema';
import { OcrService } from './ocr.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserDocument.name, schema: UserDocumentSchema }]),
  ],
  providers: [OcrService],
  exports: [OcrService],
})
export class OcrModule {}

