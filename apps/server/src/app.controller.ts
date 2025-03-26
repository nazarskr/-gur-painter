import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('save')
  async saveImage(@Body('image') image: string) {
    return this.appService.saveImage(image);
  }
}
