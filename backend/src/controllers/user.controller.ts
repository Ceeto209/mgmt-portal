import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

export class UserController {
	constructor(private userService: UserService, private authService: AuthService) { }

	getAllUsers = async (_req: Request, res: Response) => {
		try {
			const users = await this.userService.getAllUsers();
			res.json(users);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};

	createUser = async (req: Request, res: Response) => {
		try {
			const { username, password, role } = req.body;
			const user = await this.authService.register(username, password, role);
			res.status(201).json(user);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};

	deleteUser = async (req: Request, res: Response) => {
		try {
			const id = parseInt(req.params.id);
			await this.userService.deleteUser(id);
			res.status(204).send();
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};
}
