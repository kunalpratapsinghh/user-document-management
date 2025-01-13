import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAnotherMessage() {
    return 'Another Message';
  }
  getHello(): string {
    return 'Hello World!';
  }
}
