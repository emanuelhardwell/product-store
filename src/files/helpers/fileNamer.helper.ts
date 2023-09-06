import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callBack: Function,
) => {
  // Esta validación ya no es necesaria ya que en el -fileFilter- ya lo hacemos
  if (!file) {
    return callBack(new BadRequestException('The file is empty'), false);
  }

  const cutExtensionImage = file.mimetype.split('/')[1];
  const newNameImage = `${randomUUID}.${cutExtensionImage}`;

  callBack(null, newNameImage);
};
