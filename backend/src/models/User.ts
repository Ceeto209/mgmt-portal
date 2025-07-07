import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

	@Column()
	device_id?: string | null;

}
