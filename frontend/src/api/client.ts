import axios from 'axios';
import { AuthResponse, Request, RequestType, DashboardData, UserRole, RequestStatus } from '../types';

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

	createRequest: async (type: RequestType, description: string): Promise<Request> => {
		const response = await axiosInstance.post<Request>('/api/requests', {
			type,
			description,
		});
		return response.data;
	},

	getMyRequests: async (): Promise<Request[]> => {
		const response = await axiosInstance.get<Request[]>('/api/requests/my');
		return response.data;
	},

	getAllRequests: async (): Promise<Request[]> => {
		const response = await axiosInstance.get<Request[]>('/api/requests');
		return response.data;
	},

	reviewRequests: async (requestId: string, requestStatus: RequestStatus, reviewNotes?: string): Promise<Request> => {
		const response = await axiosInstance.post<Request>(`/api/requests/${requestId}/review`, {
			requestStatus,
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

	getDashboard: async (role: UserRole): Promise<DashboardData> => {
		const response = await axiosInstance.get<DashboardData>('/api/dashboard');
		return response.data;
	},
};
