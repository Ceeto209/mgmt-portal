import { AppDataSource } from '../config/data-source';
import { Device } from '../models/Device';
import { User } from '../models/User';
import { Not, FindOperator } from 'typeorm';

export class DeviceService {
	private deviceRepository = AppDataSource.getRepository(Device);
	private userRepository = AppDataSource.getRepository(User);

	async getAvailableDevies(role: 'inmate' | 'guard' | 'admin'): Promise<Device[]> {
		const devices = await this.deviceRepository.find({ where: { status: 'active', role } });
		const assigned = await this.userRepository.find({
			where: {
				device_id: Not(null) as unknown as string | FindOperator<string>,
			},
		});
		const assignedIds = assigned.map(u => u.device_id);

		return devices.filter(d => !assignedIds.includes(d.id));
	}
}
