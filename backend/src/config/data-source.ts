import { DataSource } from "typeorm";
import { Request } from '../models/Request';
import { User } from '../models/User';
import { Device } from '../models/Device';
import { DeviceAudit } from "../models/DeviceAudit";
import { Order } from '../models/Order';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT || '5432'),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: [Request, User, Device, DeviceAudit, Order],
	synchronize: true,
	logging: true,
});
