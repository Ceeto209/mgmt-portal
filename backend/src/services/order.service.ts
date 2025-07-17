import { AppDataSource } from '../config/data-source';
import { Order, OrderStatus, OrderType } from '../models/Order';
import { User } from '../models/User';

export class OrderService {
	private orderRepository = AppDataSource.getRepository(Order);
	private userRepository = AppDataSource.getRepository(User);

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

}
