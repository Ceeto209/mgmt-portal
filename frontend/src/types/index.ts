export type UserRole = 'inmate' | 'guard' | 'admin';

export interface User {
	id: string;
	username: string;
	role: UserRole;
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
	return 'totalReviews' in data && 'pendingReviewsList' in data && 'recentActivity' in data;
}

export function isAdminDashboard(data: DashboardData): data is AdminDashboard {
	return 'totalUsers' in data && 'userStats' in data && 'requestStats' in data && 'orderStats' in data && 'deviceStats' in data;
}

