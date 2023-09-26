import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const GetUserDecorator = createParamDecorator(
  (data: string, contexto: ExecutionContext) => {
    // la DATA es lo que le pase por parametro a mi DECORADOR UTILIZADO, puede ser STRING o ARRAY
    // en el CONTEXTO viene toda la info del REQUEST
    // console.log(contexto);

    const req = contexto.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw new InternalServerErrorException(
        'User not found in the Request - Contact to Admin!',
      );
    }

    // console.log(user);
    return !data ? user : user[data];
  },
);
