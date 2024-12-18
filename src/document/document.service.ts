import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './document.schema';

@Injectable()
export class DocumentService {
  constructor(@InjectModel(UserDocument.name) private readonly documentModel: Model<UserDocument>) { }
  isValidBase64Size(base64: string, maxSizeMB: number): boolean {
    const sizeInBytes = (base64.length * 3) / 4;
    return sizeInBytes <= maxSizeMB * 1024 * 1024;
  }
  async createDocument(name: string, content: string, user: any) {
    const document = new this.documentModel({
      name,
      content,
      uploadedBy: user.email,
      role: user.role
    });
    return document.save();
  }

  async getAllDocuments(user: any) {
    if (user.role === 'admin') {
      return await this.documentModel.find();
    }
    return await this.documentModel.find({ uploadedBy: user.email });
  }

  async updateDocument(docId: string, updates: any, user: any) {
    const document = await this.documentModel.findById(docId);
    if (!document) throw new NotFoundException('Document not found');
    if (
      user.role !== 'admin' &&
      (user.role !== 'editor' || document.uploadedBy !== user.email)
    ) {
      throw new ForbiddenException('You do not have permission to edit this document');
    }
    if (updates.content && !this.isValidBase64Size(updates.content, 10)) {
      throw new ForbiddenException('Document size exceeds 10 MB limit');
    }
    Object.assign(document, updates);
    return await document.save();
  }

  async deleteDocument(docId: string, user: any) {
    const document = await this.documentModel.findById(docId);
    if (!document) throw new NotFoundException('Document not found');
    if (user.role !== 'admin' && document.uploadedBy !== user.email) {
      throw new ForbiddenException('You do not have permission to delete this document');
    }
    await this.documentModel.deleteOne({ _id: docId });
    return { message: 'Document deleted successfully' };
  }
}
