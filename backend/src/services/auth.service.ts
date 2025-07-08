import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { AppDataSource } from '../config/data-source';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

export class AuthService {
	private userRepository = AppDataSource.getRepository(User);

	async login(username: string, password: string): Promise<{ token: string; user: Partial<User> }> {
		const user = await this.userRepository.findOne({ where: { username } });

		if (!user) {
			throw new Error('User not found');
		}

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			throw new Error('Invalid password');
		}

		const token = jwt.sign(
			{ id: user.id, username: user.username, role: user.role },
			JWT_SECRET!,
			{ expiresIn: JWT_EXPIRES_IN }
		);

		const { password: _, ...userWithoutPassword } = user;
		return { token, user: userWithoutPassword };
	}

	async register(username: string, password: string, role: string): Promise<Partial<User>> {
		const existingUser = await this.userRepository.findOne({ where: { username } });
		if (existingUser) {
			throw new Error('Username already exists');
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = this.userRepository.create({
			username,
			password: hashedPassword,
			role
		});

		await this.userRepository.save(user);
		const { password: _, ...userWithoutPassword } = user;
		return userWithoutPassword;
	}

	verifyToken(token: string): any {
		try {
			return jwt.verify(token, JWT_SECRET!);
		} catch (error) {
			throw new Error('Invalid token');
		}
	}
}

