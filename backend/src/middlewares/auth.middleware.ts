import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

declare global {
	namespace Express {
		interface Request {
			user?: any;
		}
	}
}

export const authMiddleware = (roles?: string[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const authHeader = req.headers.authorization;
			if (!authHeader) {
				res.status(401).json({ message: 'No token provided' });
				return;
			}

			const token = authHeader.split(' ')[1];
			const authService = new AuthService();
			const decoded = authService.verifyToken(token);

			if (roles && !roles.includes(decoded.role)) {
				res.status(403).json({ message: 'Insufficient permissions' });
				return;
			}

			req.user = decoded;
			next();
		} catch (error) {
			res.status(401).json({ message: 'Invalid token' });
		}
	};
}; 
