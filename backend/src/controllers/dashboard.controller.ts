import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
	constructor(private dashboardService: DashboardService) { }

	getDashboard = async (req: Request, res: Response) => {
		try {
			const userId = req.user.id;
			const userRole = req.user.role;

			let dashboardData;
			switch (userRole) {
				case 'inmate':
					dashboardData = await this.dashboardService.getInmateDashboard(userId);
					break;
				case 'guard':
					dashboardData = await this.dashboardService.getGuardDashboard();
					break;
				case 'admin':
					dashboardData = await this.dashboardService.getAdminDashboard();
					break;
				default:
					res.status(403).json({ message: 'Invalid Role' });
					return;
			}

			res.json(dashboardData);
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	};
}
