import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { JwtPayload } from '../types/jwt-payload.type.js';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request & { user: JwtPayload }>();
    return data ? request.user[data] : request.user;
  },
);
