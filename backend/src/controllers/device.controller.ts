import { Request, Response } from 'express';
import { DeviceService } from '../services/device.service';

export class DeviceController {
	constructor(private deviceService: DeviceService) { }

	getAvailableDevices = async (req: Request, res: Response) => {
		try {
			const role = req.query.role as 'inmate' | 'guard' | 'admin';
			if (!role) {
				throw new Error('role query param required');
			}
			const devices = await this.deviceService.getAvailableDevices(role);
			res.json(devices);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};
}
