import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { FilesService } from './files.service';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product/:imageName')
  getOneImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const url = this.filesService.getOneImage(imageName);
    // res.status(200).json({
    //   ok: true,
    //   url,
    // });
    res.status(202).sendFile(url);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: { fileSize: 1000 }
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    // console.log(file);

    return { filename: file.filename };
  }
}
