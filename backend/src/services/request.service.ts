import { AppDataSource } from '../config/data-source';
import { Request, RequestType, RequestStatus } from '../models/Request.ts';
import { User } from '../models/User';

export class RequestService {
	private requestRepository = AppDataSource.getRepository(Request);
	private userRepository = AppDataSource.getRepository(User);

	async createRequest(data: {
		inmateId: number;
		requestType: RequestType;
		description: string;
	}): Promise<Request> {
		const inmate = await this.userRepository.findOne({ where: { id: data.inmateId } });
		if (!inmate) {
			throw new Error('Inmate not found');
		}

		const request = await this.requestRepository.create({
			...data,
			requestStatus: RequestStatus.PENDING
		});

		const savedRequest = await this.requestRepository.save(request);

		return savedRequest;
	}

	async getInmateRequest(inmateId: number): Promise<Request[]> {
		return await this.requestRepository.find({
			where: { inmateId },
			relations: ['reviewer'],
			order: { createdAt: 'DESC' }
		});
	}
}
