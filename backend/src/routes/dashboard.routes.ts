import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { DashboardService } from '../services/dashboard.service';

export const createDashboardRoutes = () => {
	const router = Router();
	const dashboardService = new DashboardService();
	const dashboardController = new DashboardController(dashboardService);

	router.get('/', authMiddleware(), dashboardController.getDashboard);

	return router;
}
