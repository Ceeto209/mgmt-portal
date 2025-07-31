export type UserRole = 'inmate' | 'guard' | 'admin';

export interface User {
	id: string;
	username: string;
	device_id?: string;
	device?: Device;
	role: UserRole;
}

export interface Device {
	id: string;
	serial_number: string;
	role: UserRole;
	status: 'active' | 'deactive';
	price: number;
}

export interface DeviceWithUser extends Device {
	user?: User;
}

export interface DeviceAudit {
	id: number;
	deviceId: string;
	action: 'activate' | 'deactivate';
	reason?: string;
	performedBy: number;
	performer: User;
	createdAt: string;
}

export interface AuthResponse {
	token: string;
	user: User;
}

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
	COMMISSARRY = 'commissary',
	OTHER = 'other'
}

export interface Request {
	id: string;
	inmateId: string;
	requestType: RequestType;
	requestStatus: RequestStatus;
	description: string;
	createdAt: string;
	updatedAt: string;
}

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

export interface Order {
	orderNumber: number;
	orderItem: OrderType;
	inmateId: number;
	orderUser: User;
	orderStatus: OrderStatus;
	reviewedBy?: number;
	reviewNotes?: string;
	disputeReason?: string;
	orderCreatedDate: string;
	orderUpdatedDate: string;
}

export interface BaseDashboard {
	activeRequests: number;
	pendingReviews: number;
	disputedRequests: number;
}

export interface InmateDashboard extends BaseDashboard {
	approvedRequests: number;
	myRequests: Request[];
}

export interface GuardDashboard extends BaseDashboard {
	totalReviews: number;
	pendingReviewList: Request[];
	recentActivity: Request[];
}

export interface AdminDashboard extends BaseDashboard {
	totalUsers: number;
	recentRequests: Request[];
	userStats: {
		total: number;
		inmates: number;
		guards: number;
		admins: number;
	};
	requestStats: {
		total: number;
		pending: number;
		approved: number;
		rejected: number;
		disputed: number;
	};
	orderStats: {
		total: number;
		pending: number;
		approved: number;
		denied: number;
	};
	deviceStats: {
		total: number;
		activeDevices: number;
		deactiveDevices: number;
	};
}

export type DashboardData = InmateDashboard | GuardDashboard | AdminDashboard;

export function isInmateDashboard(data: DashboardData): data is InmateDashboard {
	return 'approvedRequests' in data && 'myRequests' in data;
}

export function isGuardDashboard(data: DashboardData): data is GuardDashboard {
	return 'totalReviews' in data && 'pendingReviewList' in data && 'recentActivity' in data;
}

export function isAdminDashboard(data: DashboardData): data is AdminDashboard {
	return 'totalUsers' in data && 'userStats' in data && 'requestStats' in data && 'orderStats' in data && 'deviceStats' in data;
}

