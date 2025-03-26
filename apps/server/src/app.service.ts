import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';

@Injectable()
export class AppService {
  async saveImage(image: string): Promise<{ message: string }> {
    if (!image?.startsWith('data:image/png;base64,')) {
      throw new Error('Invalid image format');
    }

    const base64 = image.replace(/^data:image\/png;base64,/, '');
    const filename = `image_${Date.now()}.png`;

    await writeFile(`./${filename}`, base64, 'base64');
    return { message: `Зображення збережено як ${filename}` };
  }
}
