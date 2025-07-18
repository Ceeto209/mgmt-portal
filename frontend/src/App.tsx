import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import { useAuthStore } from './stores/authStore';

// Lazy load components
const Login = React.lazy(() => import('./pages/Login'));
const InmateDashboard = React.lazy(() => import('./pages/InmateDashboard'));
const GuardDashboard = React.lazy(() => import('./pages/GuardDashboard'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
	const isAuthenticated = useAuthStore(state => state.isAuthenticated);
	const user = useAuthStore(state => state.user);

	if (!isAuthenticated || !user) {
		return <Navigate to="/login" />;
	}

	return <>{children}</>;
};

const RoleRoute = ({ role, children }: { role: string; children: React.ReactNode }) => {
	const user = useAuthStore(state => state.user);
	if (!user || user.role !== role) {
		return <Navigate to="/login" />;
	}
	return <>{children}</>;
};

function App() {
	const clearAuth = useAuthStore(state => state.clearAuth);

	useEffect(() => {
		// Clear any stale auth state on app initialization
		clearAuth();
	}, [clearAuth]);

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<React.Suspense fallback={<div>Loading...</div>}>
					<Routes>
						<Route path="/login" element={<Login />} />

						<Route path="/" element={
							<PrivateRoute>
								<Navigate to="/dashboard" />
							</PrivateRoute>
						} />

						<Route path="/dashboard" element={
							<PrivateRoute>
								<RoleRoute role="inmate">
									<InmateDashboard />
								</RoleRoute>
							</PrivateRoute>
						} />

						<Route path="/guard" element={
							<PrivateRoute>
								<RoleRoute role="guard">
									<GuardDashboard />
								</RoleRoute>
							</PrivateRoute>
						} />

						<Route path="/admin" element={
							<PrivateRoute>
								<RoleRoute role="admin">
									<AdminDashboard />
								</RoleRoute>
							</PrivateRoute>
						} />
					</Routes>
				</React.Suspense>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App; 
