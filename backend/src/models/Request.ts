import { User } from './User';

export enum RequestStatus {
	PENDING = 'pending',
	APPROVED = 'approved',
	DENIED = 'denied',
	DISPUTED = 'disputed'
}

export enum RequestType {
	TABLET = 'tablet',
	MEDICAL = 'medical',
	LEGAL = 'legal',
	VISITATION = 'visitation',
	COMMISSARY = 'commissary',
	OTHER = 'other'
}

export class Request {

	id!: number;

	inmateId!: number;

	inmate!: User;

	requestType!: RequestType;

	requestStatus!: RequestStatus;

	description!: string;

	reviewedBy?: number | null;

	reviwer?: User | null;

	reviewNotes?: string | null;

	disputeReason?: string | null;

	createdAt!: Date;

	updatedAt!: Date;

}

