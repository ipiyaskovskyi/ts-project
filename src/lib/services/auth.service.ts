import { User } from '../models';
import bcrypt from 'bcrypt';
import type { UserAttributes } from '../models/User.model';

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
  async register(
    data: RegisterData
  ): Promise<Omit<UserAttributes, 'password'>> {
    const existingUser = await User.findOne({ where: { email: data.email } });
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword as Omit<UserAttributes, 'password'>;
  }

  async login(data: LoginData): Promise<Omit<UserAttributes, 'password'>> {
    const user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword as Omit<UserAttributes, 'password'>;
  }
}
