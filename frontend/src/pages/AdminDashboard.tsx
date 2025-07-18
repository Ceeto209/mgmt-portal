import React from 'react';
import {
	Box,
	Container,
	Grid,
	Paper,
	Typography,
	Card,
	CardContent,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { AdminDashboard as AdminDashboardType, isAdminDashboard, DashboardData, Request } from '../types';

const AdminDashboard: React.FC = () => {
	const navigate = useNavigate();
	const logout = useAuthStore(state => state.logout);
	const { data: dashboardData, isLoading } = useQuery<DashboardData, Error, AdminDashboardType>({
		queryKey: ['adminDashboard'],
		queryFn: () => api.getDashboard('admin'),
		select: (data: DashboardData) => {
			if (!isAdminDashboard(data)) {
				throw new Error('Invalid dashboard data type');
			}
			return data;
		},
	});

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	if (isLoading) {
		return <Typography>Loading...</Typography>;
	}

	if (!dashboardData) {
		return <Typography>No data available</Typography>;
	}

	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
				<Typography variant="h4">
					Admin Dashboard
				</Typography>
				<Button variant="contained" color="primary" onClick={handleLogout}>
					Logout
				</Button>
			</Box>

			{/* Statistics Cards */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
				<Grid item xs={12} sm={6} md={3}>
					<Card>
						<CardContent>
							<Typography color="textSecondary" gutterBottom>
								Total Users
							</Typography>
							<Typography variant="h5">
								{dashboardData.totalUsers}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Card>
						<CardContent>
							<Typography color="textSecondary" gutterBottom>
								Active Requests
							</Typography>
							<Typography variant="h5">
								{dashboardData.activeRequests}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Card>
						<CardContent>
							<Typography color="textSecondary" gutterBottom>
								Pending Reviews
							</Typography>
							<Typography variant="h5">
								{dashboardData.pendingReviews}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Card>
						<CardContent>
							<Typography color="textSecondary" gutterBottom>
								Disputed Requests
							</Typography>
							<Typography variant="h5">
								{dashboardData.disputedRequests}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Recent Requests Table */}
			<Paper sx={{ p: 2 }}>
				<Typography variant="h6" gutterBottom>
					Recent Requests
				</Typography>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>ID</TableCell>
								<TableCell>Type</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Inmate</TableCell>
								<TableCell>Created</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{dashboardData.recentRequests.map((request: Request) => (
								<TableRow key={request.id}>
									<TableCell>{request.id}</TableCell>
									<TableCell>{request.requestType}</TableCell>
									<TableCell>{request.requestStatus}</TableCell>
									<TableCell>{request.inmateId}</TableCell>
									<TableCell>
										{new Date(request.createdAt).toLocaleDateString()}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</Container>
	);
};

export default AdminDashboard; 
