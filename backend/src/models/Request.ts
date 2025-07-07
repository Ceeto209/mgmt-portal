import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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

@Entity()
export class Request {

	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	inmateId!: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'inmateId' })
	inmate!: User;

	@Column({
		type: 'enum',
		enum: RequestType,
		default?: RequestType.OTHER
	})
	requestType!: RequestType;

	@Column({
		type: enum,
		enum: RequestStatus,
		default?: RequestStatus.PENDING
	})
	requestStatus!: RequestStatus;

	@Column('text')
	description!: string;

	@Column({ nullable: true })
	reviewedBy?: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'reviewedBy' })
	reviwer?: User;

	@Column({ nullable: true })
	reviewNotes?: string;

	@Column({ nullable: true })
	disputeReason?: string;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;

}

