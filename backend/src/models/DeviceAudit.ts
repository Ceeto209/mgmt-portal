import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Device } from './Device';
import { User } from './User';

@Entity()
export class DeviceAudit {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	deviceId!: string;

	@ManyToOne(() => Device)
	@JoinColumn({ name: 'deviceId' })
	device!: Device;

	@Column()
	action!: 'activate' | 'deactivate';

	@Column({ nullable: true })
	reason?: string;

	@Column()
	performedBy!: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'performedBy' })
	performer!: User;

	@CreateDateColumn()
	createdAt!: Date;
}
