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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { AdminDashboard as AdminDashboardType, isAdminDashboard, DashboardData, Request, RequestStatus, Order } from '../types';

const AdminDashboard: React.FC = () => {
	const navigate = useNavigate();
	const logout = useAuthStore(state => state.logout);
	const queryClient = useQueryClient();

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

	const { data: ordersData } = useQuery<Order[]>({
		queryKey: ['allOrders'],
		queryFn: api.getAllOrders,
	});

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const handleReview = async (id: string, status: RequestStatus) => {
		await api.reviewRequests(id, status);
		queryClient.invalidateQueries(['adminDashboard']);
	};

	const handleOrderReview = async (id: string, action: 'approve' | 'reject') => {
		await api.reviewRequests(id, action);
		queryClient.invalidateQueries(['allOrders']);
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
								<TableCell>Actions</TableCell>
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
									<TableCell>
										<Button
											variant="contained"
											color="success"
											size="small"
											onClick={() => handleReview(String(request.id), RequestStatus.APPROVED)}
										>
											Approve
										</Button>
										<Button
											variant="contained"
											color="error"
											size="small"
											sx={{ ml: 1 }}
											onClick={() => handleReview(String(request.id), RequestStatus.DENIED)}
										>
											Deny
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>

			{/* Orders Table */}
			<Paper sx={{ p: 2, mt: 4 }}>
				<Typography variant="h6" gutterBottom>
					Orders
				</Typography>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell>Item</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Inmate</TableCell>
								<TableCell>Created</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{ordersData && ordersData.map((order: Order) => (
								<TableRow key={order.orderNumber}>
									<TableCell>{order.orderNumber}</TableCell>
									<TableCell>{order.orderItem}</TableCell>
									<TableCell>{order.orderStatus}</TableCell>
									<TableCell>{order.inmateId}</TableCell>
									<TableCell>{new Date(order.orderCreatedDate).toLocaleDateString()}</TableCell>
									<TableCell>
										<Button
											variant="contained"
											color="success"
											size="small"
											onClick={() => handleOrderReview(String(order.orderNumber), 'approve')}
										>
											Approve
										</Button>
										<Button
											variant="contained"
											color="error"
											size="small"
											sx={{ ml: 1 }}
											onClick={() => handleOrderReview(String(order.orderNumber), 'reject')}
										>
											Deny
										</Button>
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
