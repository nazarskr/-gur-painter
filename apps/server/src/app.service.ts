import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';

@Injectable()
export class AppService {
  async saveImage(imageUrl: string): Promise<{ message: string }> {
    if (!imageUrl?.startsWith('data:image/png;base64,')) {
      throw new Error('Invalid image format');
    }

    const base64 = imageUrl.replace(/^data:image\/png;base64,/, '');
    const filename = `image_${Date.now()}.png`;

    await writeFile(`./${filename}`, base64, 'base64');
    return { message: `Зображення збережено як ${filename}` };
  }
}
