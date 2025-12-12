import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import type { SafeUser } from '../../user/models/user.types';

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): SafeUser | undefined => {
        const request = ctx.switchToHttp().getRequest<FastifyRequest>();
        return (request as FastifyRequest & { user?: SafeUser }).user;
    },
);
