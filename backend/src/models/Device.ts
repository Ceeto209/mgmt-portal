import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Device {

	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ nullable: false })
	serial_number!: string;

	@Column({ nullable: false })
	role!: 'inmate' | 'guard' | 'admin';

	@Column({ nullable: false })
	status!: "active" | "deactive";

	@Column({ nullable: false })
	price!: number;

	@CreateDateColumn()
	createDate!: Date;

	@UpdateDateColumn()
	updatedDate!: Date;

}
