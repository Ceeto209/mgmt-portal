import { Router } from 'express';
import { RequestController } from '../controllers/request.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { RequestService } from '../services/request.service';

const router = Router();
const requestService = new RequestService();
const requestController = new RequestController(requestService);

//inmate routes
router.post('/', authMiddleware(['inmate']), requestController.createRequest);
router.get('/my-requests', authMiddleware(['inmate']), requestController.getInmateRequests);
router.get('/:id', authMiddleware(['inmate', 'guard', 'admin']), requestController.getRequest);
router.post('/:id/dispute', authMiddleware(['inmate']), requestController.disputeRequest);

// admin, gaurd routes
router.get('/', authMiddleware(['guard', 'admin']), requestController.getAllRequests);
router.post('/:id/review', authMiddleware(['guard', 'admin']), requestController.reviewRequest);

export default router;
