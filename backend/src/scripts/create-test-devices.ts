import { AppDataSource } from '../config/data-source';
import { Device } from '../models/Device';

function randomSerial(prefix: string): string {
	return prefix + Math.random().toString(36).substring(2, 8);
}

async function createTestDevices() {
	await AppDataSource.initialize();
	const deviceRepository = AppDataSource.getRepository(Device);

	const devices: Partial<Device>[] = [
		...Array.from({ length: 10 }, () => ({
			serial_number: randomSerial('iTab-'),
			role: 'inmate' as const,
			status: 'active' as const,
			price: 140.99,
		})),
		...Array.from({ length: 5 }, () => ({
			serial_number: randomSerial('gTab-'),
			role: 'guard' as const,
			status: 'active' as const,
			price: 150.99,
		})),
		...Array.from({ length: 2 }, () => ({
			serial_number: randomSerial('controlTab-'),
			role: 'admin' as const,
			status: 'active' as const,
			price: 200.99,
		})),
	];

	for (const device of devices) {
		const newDevice = deviceRepository.create(device);
		await deviceRepository.save(newDevice);
		console.log(`Created device ${newDevice.serial_number} (${newDevice.role})`);
	}

	await AppDataSource.destroy();
}

createTestDevices().catch((err) => {
	console.error('Error creating test devices:', err);
});
