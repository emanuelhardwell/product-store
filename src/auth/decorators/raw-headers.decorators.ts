import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const RawHeadersDecorator = createParamDecorator(
  (data: string, contexto: ExecutionContext) => {
    const req = contexto.switchToHttp().getRequest();
    return req.rawHeaders;
  },
);
