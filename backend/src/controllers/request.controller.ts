import { Request as ExpressRequest, Response } from 'express';
import { RequestService } from '../services/request.service';
import { RequestStatus, RequestType } from '../models/Request';

export class RequestController {
	constructor(private requestService: RequestService) { };

	createRequest = async (req: ExpressRequest, res: Response) => {
		try {
			const { requestType, description } = req.body;
			const inmateId = req.user.id;
			//const type = req.query.requestType as RequestType; Maybe need to try this, had an issue where submitting a request was always defaulting to OTHER

			const request = await this.requestService.createRequest({
				inmateId,
				requestType,
				description
			});

			res.status(201).json(request);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};

	getRequest = async (req: ExpressRequest, res: Response) => {
		try {
			const requestId = parseInt(req.params.id);
			const request = await this.requestService.getRequestById(requestId);

			res.json(request);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};

	getInmateRequests = async (req: ExpressRequest, res: Response) => {
		try {
			const inmateId = req.user.id;
			const requests = await this.requestService.getInmateRequest(inmateId);

			res.json(requests);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};

	getAllRequests = async (req: ExpressRequest, res: Response) => {
		try {
			const status = req.query.status as RequestStatus | undefined;
			const requests = await this.requestService.getAllRequests(status);

			res.json(requests);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};

	reviewRequest = async (req: ExpressRequest, res: Response) => {
		try {
			const requestId = parseInt(req.params.id);
			const { status, reviewNotes } = req.body;
			const reviewerId = req.user.id;

			const request = await this.requestService.reviewRequest(
				requestId,
				reviewerId,
				status,
				reviewNotes
			);

			res.json(request);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};

	disputeRequest = async (req: ExpressRequest, res: Response) => {
		try {
			const requestId = parseInt(req.params.id);
			const { disputeReason } = req.body;

			const request = await this.requestService.disputedRequest(
				requestId,
				disputeReason
			);

			res.json(request);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};

	deleteRequest = async (req: ExpressRequest, res: Response) => {
		try {
			const requestId = parseInt(req.params.id);
			const inmateId = req.user.id;

			await this.requestService.deleteRequest(requestId, inmateId);
			res.status(204).send();
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	};
}
