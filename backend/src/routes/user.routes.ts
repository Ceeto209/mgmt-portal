import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

export const createUserRoutes = () => {
	const router = Router();
	const userService = new UserService();
	const authService = new AuthService();
	const userController = new UserController(userService, authService);

	router.get('/', authMiddleware(['admin']), userController.getAllUsers);
	router.post('/', authMiddleware(['admin']), userController.createUser);
	router.delete('/:id', authMiddleware(['admin']), userController.deleteUser);

	return router;
};
