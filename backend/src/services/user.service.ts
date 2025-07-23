import { AppDataSource } from '../config/data-source';
import { User } from '../models/User';

export class UserService {
	private userRepository = AppDataSource.getRepository(User);

	async getAllUsers(): Promise<User[]> {
		return this.userRepository.find();
	}

	async createUser(username: string, password: string, role: string): Promise<User> {
		const existing = await this.userRepository.findOne({ where: { username } });
		if (existing) throw new Error('Username already exists');
		const user = this.userRepository.create({ username, password, role });
		return await this.userRepository.save(user);
	}

	async deleteUser(id: number): Promise<void> {
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) throw new Error('User not found');
		await this.userRepository.remove(user);
	}
}
