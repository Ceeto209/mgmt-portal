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

	getOwnOrders = async (req: Request, res: Response) => {
		try {
			const inmateId = req.user.id;
			const orders = await this.orderService.getOrdersByUser(inmateId);
			res.json(orders);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};

	getAllOrders = async (req: Request, res: Response) => {
		try {
			const status = req.query.status as OrderStatus | undefined;
			const orders = await this.orderService.getAllOrders(status);
			res.json(orders);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};

	reviewOrder = async (req: Request, res: Response) => {
		try {
			const orderNumber = parseInt(req.params.id);
			const reviewerId = req.user.id;
			const { action, reviewNotes } = req.body;
			let status;
			if (action === 'approve') status = OrderStatus.APPROVED;
			else if (action === 'reject') status = OrderStatus.DENIED;
			else throw new Error('Invalid action');
			const order = await this.orderService.reviewOrder(orderNumber, reviewerId, status, reviewNotes);
			res.json(order);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};

}
