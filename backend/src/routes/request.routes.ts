import { Router } from 'express';
import { RequestController } from '../controllers/request.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { RequestService } from '../services/request.service';

export const createRequestRoutes = () => {
	const router = Router();
	const requestService = new RequestService();
	const requestController = new RequestController(requestService);

	//inmate routes
	router.post('/', authMiddleware(['inmate']), requestController.createRequest);
	router.get('/my-requests', authMiddleware(['inmate']), requestController.getInmateRequests);
	router.get('/:id', authMiddleware(['inmate', 'guard', 'admin']), requestController.getRequest);
	router.post('/:id/dispute', authMiddleware(['inmate']), requestController.disputeRequest);
	router.delete('/:id', authMiddleware(['inmate']), requestController.deleteRequest);

	// admin, gaurd routes
	router.get('/', authMiddleware(['guard', 'admin']), requestController.getAllRequests);
	router.post('/:id/review', authMiddleware(['guard', 'admin']), requestController.reviewRequest);

	return router;
}
