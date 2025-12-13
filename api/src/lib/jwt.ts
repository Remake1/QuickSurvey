import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
}

const secret = new TextEncoder().encode(JWT_SECRET);
const ALGORITHM = 'HS256';
const EXPIRATION_TIME = '7d';

export interface JWTPayload extends JoseJWTPayload {
    userId: string;
}

export const jwt = {
    async sign(payload: { userId: string }): Promise<string> {
        return new SignJWT(payload)
            .setProtectedHeader({ alg: ALGORITHM })
            .setIssuedAt()
            .setExpirationTime(EXPIRATION_TIME)
            .sign(secret);
    },

    async verify(token: string): Promise<JWTPayload | null> {
        try {
            const { payload } = await jwtVerify(token, secret, {
                algorithms: [ALGORITHM],
            });
            if (typeof payload.userId !== 'string') {
                return null;
            }
            return payload as JWTPayload;
        } catch {
            return null;
        }
    },
};
