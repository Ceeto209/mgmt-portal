import { AppDataSource } from '../config/data-source';
import { Device } from '../models/Device';
import { DeviceAudit } from '../models/DeviceAudit';
import { User } from '../models/User';
import { Not, FindOperator, In } from 'typeorm';

export class DeviceService {
	private deviceRepository = AppDataSource.getRepository(Device);
	private userRepository = AppDataSource.getRepository(User);
	private auditRepository = AppDataSource.getRepository(DeviceAudit);

	async getAvailableDevices(role: 'inmate' | 'guard' | 'admin'): Promise<Device[]> {
		const devices = await this.deviceRepository.find({ where: { status: 'active', role } });
		const assigned = await this.userRepository.find({
			where: {
				device_id: Not(null) as unknown as string | FindOperator<string>,
			},
		});
		const assignedIds = assigned.map(u => u.device_id);

		return devices.filter(d => !assignedIds.includes(d.id));
	}

	async listDevices(options: {
		status?: 'active' | 'deactive';
		search?: string;
		page?: number;
		limit?: number;
	}): Promise<{ devices: (Device & { user?: User })[]; total: number }> {
		const { status, search, page = 1, limit = 10 } = options;

		const qb = this.deviceRepository.createQueryBuilder('device')
			.leftJoinAndMapOne('device.user', User, 'user', 'user.device_id = device.id');

		if (status) qb.andWhere('device.status = :status', { status });
		if (search) qb.andWhere(
			'(device.serial_number ILIKE :s OR user.username ILIKE :s)',
			{ s: `%${search}%` }
		);

		qb.orderBy('device.updatedDate', 'DESC')
			.skip((page - 1) * limit)
			.take(limit);

		const [devices, total] = await qb.getManyAndCount();
		return { devices: devices as (Device & { user?: User })[], total };
	}

	async updateStatus(deviceId: string, status: 'active' | 'deactive', performedBy: number, reason?: string): Promise<Device> {
		const device = await this.deviceRepository.findOne({ where: { id: deviceId } });
		if (!device) throw new Error('Device not found');
		device.status = status;
		const updated = await this.deviceRepository.save(device);
		const audit = this.auditRepository.create({
			deviceId,
			action: status === 'active' ? 'activate' : 'deactivate',
			reason,
			performedBy,
		});
		await this.auditRepository.save(audit);
		return updated;
	}

	async getAudits(deviceId: string): Promise<DeviceAudit[]> {
		return await this.auditRepository.find({
			where: { deviceId },
			relations: ['performer', 'device'],
			order: { createdAt: 'DESC' },
		});
	}
}
