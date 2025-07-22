import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Device } from './Device';

export enum OrderStatus {
	PENDING = 'pending',
	APPROVED = 'approved',
	DENIED = 'denied',
	DISPUTED = 'disputed'
}

export enum OrderType {
	TABLET = 'tablet',
	DEVICE = 'device',
	ACCESSORY = 'accessory',
	COMMISSARY = 'commissary',
	OTHER = 'other'
}

@Entity()
export class Order {

	@PrimaryGeneratedColumn()
	orderNumber!: number;

	@Column({
		type: 'enum',
		enum: OrderType,
		default: OrderType.OTHER
	})
	orderItem!: OrderType;

	@Column()
	inmateId!: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'inmateId' })
	orderUser!: User;

	@Column({
		type: 'enum',
		enum: OrderStatus,
		default: OrderStatus.PENDING
	})
	orderStatus!: OrderStatus;

	@Column({ nullable: true })
	reviewedBy?: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'reviewedBy' })
	reviewer?: User;

	@Column({ nullable: true })
	reviewNotes?: string;

	@Column({ nullable: true })
	disputeReason?: string;

	@CreateDateColumn()
	orderCreatedDate!: Date;

	@UpdateDateColumn()
	orderUpdatedDate!: Date;

}
