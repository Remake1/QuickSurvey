import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

interface SessionData {
    userId?: number;
}

@Injectable()
export class SessionAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context
            .switchToHttp()
            .getRequest<FastifyRequest & { session: SessionData }>();
        const userId = request.session?.userId;
        if (!userId) {
            throw new UnauthorizedException('Not authenticated');
        }
        return true;
    }
}
