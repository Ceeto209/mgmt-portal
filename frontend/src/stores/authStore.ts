import { create } from 'zustand';
import { User, AuthResponse } from '../types';
import { api } from '../api/client';

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	login: (username: string, password: string) => Promise<AuthResponse>;
	logout: () => void;
	clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	token: null,
	isAuthenticated: false,

	login: async (username: string, password: string) => {
		try {
			const response = await api.login(username, password);
			localStorage.setItem('token', response.token);
			set({ user: response.user, token: response.token, isAuthenticated: true });

			// add connection to websocket later
			return response;
		} catch (error) {
			console.error('login failed', error);
			throw error;
		}
	},

	logout: () => {
		localStorage.removeItem('token');
		// remove connection from websocket later
		set({ user: null, token: null, isAuthenticated: false });
	},

	clearAuth: () => {
		localStorage.removeItem('token');
		// remove connection from websocket later
		set({ user: null, token: null, isAuthenticated: false });
	}
}));
