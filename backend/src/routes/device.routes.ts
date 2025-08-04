import { Router } from 'express';
import { DeviceController } from '../controllers/device.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { DeviceService } from '../services/device.service';

export const createDeviceRoutes = () => {
	const router = Router();
	const deviceService = new DeviceService();
	const deviceController = new DeviceController(deviceService);

	router.get('/available', authMiddleware(['admin', 'guard']), deviceController.getAvailableDevices);
	router.get('/', authMiddleware(['admin', 'guard']), deviceController.listDevices);
	router.patch('/:id/status', authMiddleware(['admin', 'guard']), deviceController.updateStatus);
	router.patch('/:id/user', authMiddleware(['admin', 'guard']), deviceController.updateUser);
	router.get('/:id/audits', authMiddleware(['admin', 'guard']), deviceController.getAudits);

	return router;
};
