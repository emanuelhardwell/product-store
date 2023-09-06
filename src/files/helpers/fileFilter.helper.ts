import { BadRequestException } from '@nestjs/common';

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callBack: Function,
) => {
  if (!file) {
    return callBack(new BadRequestException('The file is empty'), false);
  }

  const imageExtensionValidate = ['jpg', 'jpeg', 'png', 'gif'];
  const cutExtensionImage = file.mimetype.split('/')[1];

  if (!imageExtensionValidate.includes(cutExtensionImage)) {
    return callBack(
      new BadRequestException('Extension of image invalid'),
      false,
    );
  }

  callBack(null, true);
};
