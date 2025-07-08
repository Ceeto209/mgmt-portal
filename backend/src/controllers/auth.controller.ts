import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
	private authService: AuthService;

	constructor() {
		this.authService = new AuthService();
	}

	login = async (req: Request, res: Response) => {
		try {
			const { username, password } = req.body;
			const result = await this.authService.login(username, password);
			res.json(result);
		} catch (error: any) {
			res.status(401).json({ message: error.message });
		}
	};

	register = async (req: Request, res: Response) => {
		try {
			const { username, password, role } = req.body;
			const user = await this.authService.register(username, password, role);
			res.status(201).json(user);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};
}

