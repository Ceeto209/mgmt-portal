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

	@Column({ nullable: true })
	device_id?: string;

}
