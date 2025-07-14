import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { OrderStatus, OrderType } from '../models/Order';

export class OrderController {
	constructor(private orderService: OrderService) { };

	createOrder = async (req: Request, res: Response) => {

		try {
			const { orderItem } = req.body;
			const inmateId = req.user.id;

			const order = await this.orderService.createOrder({
				inmateId,
				orderItem
			});

			res.status(201).json(order);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};

}
