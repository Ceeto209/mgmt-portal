import { AppDataSource } from '../config/data-source';
import { Request, RequestStatus } from '../models/Request';
import { User } from '../models/User';
import { Order, OrderStatus } from '../models/Order';
import { Device } from '../models/Device';

export class DashboardService {
	private requestRepository = AppDataSource.getRepository(Request);
	private userRepository = AppDataSource.getRepository(User);
	private orderRepository = AppDataSource.getRepository(Order);
	private deviceRepository = AppDataSource.getRepository(Device);

	async getInmateDashboard(inmateId: number) {
		const requests = await this.requestRepository.find({
			where: { inmateId },
			relations: ['reviewer'],
			order: { createdAt: 'DESC' }
		});

		return {
			activeRequests: requests.filter(r => r.requestStatus === RequestStatus.PENDING).length,
			pendingReviews: requests.filter(r => r.requestStatus === RequestStatus.PENDING).length,
			disputedRequests: requests.filter(r => r.requestStatus === RequestStatus.DISPUTED).length,
			approvedRequests: requests.filter(r => r.requestStatus === RequestStatus.APPROVED).length,
			myRequests: requests.slice(0, 5)
		};
	}

	async getGuardDashboard() {
		const requests = await this.requestRepository.find({
			relations: ['inmate'],
			order: { createdAt: 'DESC' }
		});

		const pendingRequests = requests.filter(r => r.requestStatus === RequestStatus.PENDING);
		const disputedRequests = requests.filter(r => r.requestStatus === RequestStatus.DISPUTED);

		return {
			activeRequests: pendingRequests.length,
			pendingReviews: pendingRequests.length,
			disputedRequests: disputedRequests.length,
			totalReviews: requests.length,
			pendingReviewList: pendingRequests.slice(0, 10),
			recentActivity: requests.slice(0, 10)
		};
	}

	async getAdminDashboard() {
		const [requests, users, orders, devices] = await Promise.all([
			this.requestRepository.find({
				relations: ['inmate', 'reviewer'],
				order: { createdAt: 'DESC' }
			}),
			this.userRepository.find(),
			this.orderRepository.find(),
			this.deviceRepository.find()
		]);

		const pendingRequests = requests.filter(r => r.requestStatus === RequestStatus.PENDING);
		const disputedRequests = requests.filter(r => r.requestStatus === RequestStatus.DISPUTED);

		return {
			activeRequests: pendingRequests.length,
			pendingReviews: pendingRequests.length,
			disputedRequests: disputedRequests.length,
			totalUsers: users.length,
			recentRequests: requests.slice(0, 10),
			userStats: {
				total: users.length,
				inmates: users.filter(u => u.role === 'inmate').length,
				guards: users.filter(u => u.role === 'guard').length,
				admins: users.filter(u => u.role === 'admin').length
			},
			requestStats: {
				total: requests.length,
				pending: pendingRequests.length,
				approved: requests.filter(r => r.requestStatus === RequestStatus.APPROVED).length,
				rejected: requests.filter(r => r.requestStatus === RequestStatus.DENIED).length
			},
			orderStats: {
				total: orders.length,
				pending: orders.filter(o => o.orderStatus === OrderStatus.PENDING).length,
				approved: orders.filter(o => o.orderStatus === OrderStatus.APPROVED).length,
				denied: orders.filter(o => o.orderStatus === OrderStatus.DENIED).length
			},
			deviceStats: {
				total: devices.length,
				activeDevices: devices.filter(d => d.status === 'active').length,
				deactiveDevices: devices.filter(d => d.status === 'deactive').length
			}
		};
	}
}
