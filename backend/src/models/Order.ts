import { User } from './User';
import { Device } from './Device';

export class Order {

	orderNumber!: number;

	orderItem!: string | Device;

	orderUser!: User;

	oderStatus!: string;

	orderCreatedDate!: Date;

	orderUpdatedDate!: Date;

}
