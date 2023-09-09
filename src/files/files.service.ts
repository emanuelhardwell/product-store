import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  @Get()
  getOneImage(imageName: string) {
    const path = join(__dirname, '../../static/products', imageName);

    if (!existsSync(path)) {
      throw new NotFoundException(
        `The image with name ${imageName} not exists`,
      );
    }

    return path;
  }
}
