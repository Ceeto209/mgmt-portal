import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Device } from './Device';

@Entity()
export class User {

	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	username!: string;

	@Column()
	password!: string;

	@Column()
	role!: string;

	@Column({ nullable: true })
	device_id?: string;

	@ManyToOne(() => Device, { nullable: true })
	@JoinColumn({ name: 'device_id' })
	device?: Device;

}
