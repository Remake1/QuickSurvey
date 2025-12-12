import { Injectable, ConflictException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserService } from '../user/user.service';
import type { RegisterDto } from './dto/register.dto';
import type { SafeUser } from '../user/models/user.types';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    /**
     * Validate user credentials
     */
    async validateUser(
        email: string,
        password: string,
    ): Promise<SafeUser | null> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            return null;
        }
        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            return null;
        }
        return this.userService.excludePassword(user);
    }

    /**
     * Register a new user
     */
    async register(dto: RegisterDto): Promise<SafeUser> {
        const existingUser = await this.userService.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }
        return this.userService.create(dto);
    }

    /**
     * Get user by ID (for session restoration)
     */
    async getUserById(id: number): Promise<SafeUser | null> {
        const user = await this.userService.findById(id);
        if (!user) {
            return null;
        }
        return this.userService.excludePassword(user);
    }
}
