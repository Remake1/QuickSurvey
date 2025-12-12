import {
    Controller,
    Post,
    Get,
    Body,
    Req,
    Res,
    UseGuards,
    HttpCode,
    HttpStatus,
    UsePipes,
    UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthService } from './auth.service';
import { RegisterSchema, type RegisterDto } from './dto/register.dto';
import { LoginSchema, type LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionAuthGuard } from './guards/session-auth.guard';
import type { SafeUser } from '../user/models/user.types';

interface SessionData {
    userId?: number;
}

type RequestWithSession = FastifyRequest & {
    session: SessionData;
    user?: SafeUser;
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ZodValidationPipe(RegisterSchema))
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email' },
                name: { type: 'string', minLength: 2 },
                password: { type: 'string', minLength: 8 },
            },
            required: ['email', 'name', 'password'],
        },
    })
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    @ApiResponse({ status: 409, description: 'User already exists' })
    async register(@Body() dto: RegisterDto): Promise<SafeUser> {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @UsePipes(new ZodValidationPipe(LoginSchema))
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' },
            },
            required: ['email', 'password'],
        },
    })
    @ApiResponse({ status: 200, description: 'Successfully logged in' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    login(@Req() req: RequestWithSession, @Body() _dto: LoginDto): SafeUser {
        void _dto;
        const user = req.user;
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        req.session.userId = user.id;
        return user;
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(SessionAuthGuard)
    @ApiOperation({ summary: 'Logout and destroy session' })
    @ApiResponse({ status: 200, description: 'Successfully logged out' })
    @ApiResponse({ status: 401, description: 'Not authenticated' })
    logout(
        @Req() req: RequestWithSession,
        @Res({ passthrough: true }) res: FastifyReply,
    ): { message: string } {
        req.session.userId = undefined;
        res.clearCookie('session');
        return { message: 'Logged out successfully' };
    }

    @Get('me')
    @UseGuards(SessionAuthGuard)
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Current user profile' })
    @ApiResponse({ status: 401, description: 'Not authenticated' })
    async me(@Req() req: RequestWithSession): Promise<SafeUser> {
        const userId = req.session.userId;
        if (!userId) {
            throw new UnauthorizedException('Not authenticated');
        }
        const user = await this.authService.getUserById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }
}
