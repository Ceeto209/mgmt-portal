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

	listDevices = async (req: Request, res: Response) => {
		try {
			const { status, search, page, limit } = req.query as any;
			const result = await this.deviceService.listDevices({
				status,
				search,
				page: page ? parseInt(page) : 1,
				limit: limit ? parseInt(limit) : 10,
			});
			res.json(result);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};

	updateStatus = async (req: Request, res: Response) => {
		try {
			const { status, reason } = req.body as { status: 'active' | 'deactive'; reason?: string };
			const { id } = req.params;
			const userId = req.user.id;
			const device = await this.deviceService.updateStatus(id, status, userId, reason);
			res.json(device);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};

	updateUser = async (req: Request, res: Response) => {
		try {
			const { status, reason } = req.body as { status: 'active' | 'deactive'; reason?: string };
			const { id } = req.params;
			const userId = req.user.id;
			const device = await this.deviceService.updateStatus(id, status, userId, reason);
			res.json(device);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};

	getAudits = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const audits = await this.deviceService.getAudits(id);
			res.json(audits);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};
}
