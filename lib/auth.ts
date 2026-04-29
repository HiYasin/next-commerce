import { User, UserRole } from '@/types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './db';

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = parseInt(process.env.SALT_ROUNDS || '10');
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}

export const generateToken = (userId: string): string => {
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key';
    const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
    return token;
}

export const verifyToken = (token: string): { userId: string } | null => {
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key';
    try {
        const decoded = jwt.verify(token, jwtSecret) as { userId: string };
        return decoded;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}


export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) {
            return null;
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return null;
        }
        const userFromDb = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!userFromDb) {
            return null;
        }

        const { passwordHash, ...user } = userFromDb;
        return user as User;

    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}

export const checkUserPermission = (user: User | null, requiredRole: UserRole): boolean => {
    const roleHierarchy = {
        [UserRole.GUEST]: 0,
        [UserRole.CUSTOMER]: 1,
        [UserRole.MANAGER]: 2,
        [UserRole.ADMIN]: 3,
    };

    if (!user) {
        return false;
    }

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};