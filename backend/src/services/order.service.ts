import { AppDataSource } from '../config/data-source';
import { Order, OrderStatus, OrderType } from '../models/Order';
import { User } from '../models/User';
import { Device } from '../models/Device';

export class OrderService {
	private orderRepository = AppDataSource.getRepository(Order);
	private userRepository = AppDataSource.getRepository(User);
	private deviceRepository = AppDataSource.getRepository(Device);

	async createOrder(data: {
		inmateId: number;
		orderItem: OrderType;
	}): Promise<Order> {
		const inmate = await this.userRepository.findOne({ where: { id: data.inmateId } });
		if (!inmate) {
			throw new Error('Inmate not found');
		}

		const order = this.orderRepository.create({
			...data,
			orderStatus: OrderStatus.PENDING
		});

		const savedOrder = await this.orderRepository.save(order);

		return savedOrder;
	}

	async getOrderById(orderNumber: number): Promise<Order> {
		const order = await this.orderRepository.findOne({
			where: { orderNumber },
			relations: ['orderUser', 'reviewer']
		});
		if (!order) {
			throw new Error('Order not found.');
		}
		return order;
	}

	async getOrdersByUser(inmateId: number): Promise<Order[]> {
		return await this.orderRepository.find({
			where: { inmateId },
			relations: ['orderUser', 'reviewer'],
			order: { orderCreatedDate: 'DESC' }
		});
	}

	async getAllOrders(status?: OrderStatus): Promise<Order[]> {
		const where = status ? { orderStatus: status } : {};
		return await this.orderRepository.find({
			where,
			relations: ['orderUser', 'reviewer'],
			order: { orderCreatedDate: 'DESC' }
		});
	}

	async reviewOrder(
		orderNumber: number,
		reviewerId: number,
		status: OrderStatus,
		reviewNotes?: string,
		deviceId?: string
	): Promise<Order> {
		const order = await this.getOrderById(orderNumber);
		const reviewer = await this.userRepository.findOne({ where: { id: reviewerId } });
		if (!reviewer) {
			throw new Error('Reviewer not found');
		}
		if (order.orderStatus !== OrderStatus.PENDING && order.orderStatus !== OrderStatus.DISPUTED) {
			throw new Error('Order cannot be reviewed in its current state');
		}
		order.orderStatus = status;
		order.reviewedBy = reviewerId;
		order.reviewNotes = reviewNotes;
		const updatedOrder = await this.orderRepository.save(order);

		if (deviceId) {
			const device = await this.deviceRepository.findOne({ where: { id: deviceId, status: 'active' } });

			if (!device) throw new Error('Device not available');

			const assigned = await this.userRepository.findOne({ where: { device_id: deviceId } });
			if (assigned) throw new Error('Device already assigned');

			const user = await this.userRepository.findOne({ where: { id: order.inmateId } });
			if (!user) {
				throw new Error('User not found');
			}

			if (device.role !== user.role) {
				throw new Error('Device role mismatch');
			}

			user.device_id = deviceId;
			await this.userRepository.save(user);

		}

		return updatedOrder;
	}
}
