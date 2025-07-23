import { Request, Response } from 'express';
import { DeviceService } from '../services/device.service';

export class DeviceController {
	constructor(private deviceService: DeviceService) { }

	getAvailableDevices = async (_req: Request, res: Response) => {
		try {
			const devices = await this.deviceService.getAvailableDevies();
			res.json(devices);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};
}
