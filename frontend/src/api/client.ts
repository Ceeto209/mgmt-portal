import axios from 'axios';
import { AuthResponse, Request, RequestType, DashboardData, UserRole, RequestStatus, User, Device } from '../types';

const axiosInstance = axios.create({
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const api = {
	// Auth
	login: async (username: string, password: string): Promise<AuthResponse> => {
		const response = await axiosInstance.post<AuthResponse>('/api/auth/login', {
			username,
			password,
		});
		return response.data;
	},

	createRequest: async (requestType: RequestType, description: string): Promise<Request> => {
		const response = await axiosInstance.post<Request>('/api/requests', {
			requestType,
			description,
		});
		return response.data;
	},

	getMyRequests: async (): Promise<Request[]> => {
		const response = await axiosInstance.get<Request[]>('/api/requests/my-requests');
		return response.data;
	},

	getAllRequests: async (): Promise<Request[]> => {
		const response = await axiosInstance.get<Request[]>('/api/requests');
		return response.data;
	},

	reviewRequests: async (requestId: string, status: RequestStatus, reviewNotes?: string): Promise<Request> => {
		const response = await axiosInstance.post<Request>(`/api/requests/${requestId}/review`, {
			status,
			reviewNotes,
		});
		return response.data;
	},

	disputeRequest: async (requestId: string, disputeReason: string): Promise<Request> => {
		const response = await axiosInstance.post<Request>(`/api/requests/${requestId}/dispute`, {
			disputeReason,
		});
		return response.data;
	},

	deleteRequest: async (requestId: string): Promise<void> => {
		await axiosInstance.delete(`/api/requests/${requestId}`);
	},

	getDashboard: async (role: UserRole): Promise<DashboardData> => {
		const response = await axiosInstance.get<DashboardData>('/api/dashboard');
		return response.data;
	},

	getMyOrders: async () => {
		const response = await axiosInstance.get('/api/orders/my-orders');
		return response.data;
	},

	getAllOrders: async (status?: string) => {
		const response = await axiosInstance.get('/api/orders', {
			params: status ? { status } : {},
		});
		return response.data;
	},

	reviewOrder: async (orderNumber: string, action: 'approve' | 'reject', reviewNotes?: string, deviceId?: string) => {
		const response = await axiosInstance.patch(`/api/orders/${orderNumber}/review`, {
			action,
			reviewNotes,
			deviceId,
		});
		return response.data;
	},

	createOrder: async (orderItem: string) => {
		const response = await axiosInstance.post('/api/orders', { orderItem });
		return response.data;
	},

	getUsers: async (): Promise<User[]> => {
		const response = await axiosInstance.get('/api/users');
		return response.data;
	},

	createUser: async (username: string, password: string, role: string): Promise<User> => {
		const response = await axiosInstance.post('/api/users', { username, password, role });
		return response.data;
	},

	deleteUser: async (id: number): Promise<void> => {
		await axiosInstance.delete(`/api/users/${id}`);
	},

	getAvailableDevices: async (role: UserRole): Promise<Device[]> => {
		const response = await axiosInstance.get('/api/devices/available', { params: { role } });
		return response.data;
	},
};
