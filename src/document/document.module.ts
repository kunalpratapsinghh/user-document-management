import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { JwtStrategy } from 'src/rolePermission/jwt.strategy';
import { RolesGuard } from 'src/rolePermission/roles.guard';
import { UserDocument, UserDocumentSchema } from './document.schema';
import { BullQueueModule } from 'src/bull-queue/bull-queue.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserDocumentSchema },
    ]),
    BullQueueModule
  ],
  controllers: [DocumentController],
  providers: [DocumentService, JwtStrategy, RolesGuard],
})
export class DocumentModule {}
