import { AppDataSource } from '../config/data-source';
import { Request, RequestType, RequestStatus } from '../models/Request';
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

		const request = this.requestRepository.create({
			...data,
			requestStatus: RequestStatus.PENDING
		});

		const savedRequest = await this.requestRepository.save(request);

		return savedRequest;
	}

	async getRequestById(id: number): Promise<Request> {
		const request = await this.requestRepository.findOne({
			where: { id },
			relations: ['inmate', 'reviewer']
		});

		if (!request) {
			throw new Error('Request not found.');
		}

		return request;
	}

	async getInmateRequest(inmateId: number): Promise<Request[]> {
		return await this.requestRepository.find({
			where: { inmateId },
			relations: ['reviewer'],
			order: { createdAt: 'DESC' }
		});
	}

	async getAllRequests(status?: RequestStatus): Promise<Request[]> {
		const where = status ? { requestStatus: status } : {};

		return await this.requestRepository.find({
			where,
			relations: ['inmate', 'reviewer'],
			order: { createdAt: 'DESC' }
		});
	}

	async reviewRequest(
		requestId: number,
		reviewerId: number,
		status: RequestStatus,
		reviewNotes?: string
	): Promise<Request> {
		const request = await this.getRequestById(requestId);
		const reviewer = await this.userRepository.findOne({ where: { id: reviewerId } });

		if (!reviewer) {
			throw new Error('Reviewer not found');
		}

		if (request.requestStatus !== RequestStatus.PENDING && request.requestStatus !== RequestStatus.DISPUTED) {
			throw new Error('Request cannot be reviewed in its current state');
		}

		request.requestStatus = status;
		request.reviewedBy = reviewerId;
		request.reviewNotes = reviewNotes;

		const updatedRequest = await this.requestRepository.save(request);
		return updatedRequest;
	}

	async disputedRequest(requestId: number, disputeReason: string): Promise<Request> {
		const request = await this.getRequestById(requestId);

		if (request.requestStatus !== RequestStatus.DENIED) {
			throw new Error('Only denied request can be disputed');
		}

		request.requestStatus = RequestStatus.DISPUTED;
		request.disputeReason = disputeReason;

		const updateRequest = await this.requestRepository.save(request);
		return updateRequest;
	}

	async deleteRequest(requestId: number, inmateId: number): Promise<void> {
		const request = await this.getRequestById(requestId);
		if (request.inmateId !== inmateId) {
			throw new Error('Not authorized to delete this request');
		}
		if (request.requestStatus === RequestStatus.DENIED || request.requestStatus === RequestStatus.DISPUTED) {
			throw new Error('Cannot delete a request that is denied or disputed');
		}
		await this.requestRepository.remove(request);
	}
}
