import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DocumentService } from './document.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/rolePermission/roles.guard';
import { Roles } from 'src/rolePermission/roles.decorator';
import * as multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { BullQueueService } from 'src/bull-queue/bull-queue.service';

@Controller('documents')
@UseGuards(AuthGuard('jwt')) 
export class DocumentController {
  constructor(private readonly documentService: DocumentService,
    private readonly bullQueueService : BullQueueService
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.mimetype)) {
          return callback(new Error('Invalid file type'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadDocument(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    const user = req.user;
    const base64Content = file.buffer.toString('base64');
    const document = await this.documentService.createDocument(
      file.originalname,
      base64Content,
      user,
    );
      await this.bullQueueService.sendMessageToQueue(document._id.toString());
    return document;
  }

  @Get()
  async getDocuments(@Req() req) {
    return this.documentService.getAllDocuments(req.user);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  async updateDocument(@Param('id') id: string, @Body() body: any, @Req() req) {
    return this.documentService.updateDocument(id, body, req.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async deleteDocument(@Param('id') id: string, @Req() req) {
    return this.documentService.deleteDocument(id, req.user);
  }
}
