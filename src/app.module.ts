import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { DocumentModule } from './document/document.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nestjs-user-management'),
    AuthModule,
    DocumentModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
