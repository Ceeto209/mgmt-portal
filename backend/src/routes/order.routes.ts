import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { OrderService } from '../services/order.service';

export const createOrderRoutes = () => {
	const router = Router();
	const orderService = new OrderService();
	const orderController = new OrderController(orderService);

	router.post('/', authMiddleware(['inmate']), orderController.createOrder);
	router.get('/my-orders', authMiddleware(['inmate']), orderController.getOwnOrders);
	router.get('/', authMiddleware(['guard', 'admin']), orderController.getAllOrders);
	router.patch('/:id/review', authMiddleware(['guard', 'admin']), orderController.reviewOrder);

	return router;
};
