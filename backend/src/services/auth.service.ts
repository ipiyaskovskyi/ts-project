import bcrypt from 'bcrypt';
import { User } from '../models/index.js';

export interface RegisterData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export class AuthService {
    async register(data: RegisterData) {
        const existingUser = await User.findOne({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await User.create({
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            password: hashedPassword,
        });

        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        };
    }

    async login(data: LoginData) {
        const user = await User.findOne({
            where: { email: data.email },
        });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.password
        );
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        };
    }
}
