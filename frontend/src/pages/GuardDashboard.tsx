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
import { GuardDashboard as GuardDashboardType, isGuardDashboard, DashboardData, Request, RequestStatus } from '../types';

const GuardDashboard: React.FC = () => {
	const navigate = useNavigate();
	const logout = useAuthStore(state => state.logout);
	const queryClient = useQueryClient();

	const { data: dashboardData, isLoading } = useQuery<DashboardData, Error, GuardDashboardType>({
		queryKey: ['guardDashboard'],
		queryFn: () => api.getDashboard('guard'),
		select: (data: DashboardData) => {
			if (!isGuardDashboard(data)) {
				throw new Error('Invalid dashboard data type');
			}
			return data;
		},
	});

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const handleReview = async (id: string, status: RequestStatus) => {
		await api.reviewRequests(id, status);
		queryClient.invalidateQueries({ queryKey: ['guardDashboard'] });
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
					Guard Dashboard
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
								Disputed Requests
							</Typography>
							<Typography variant="h5">
								{dashboardData.disputedRequests}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Card>
						<CardContent>
							<Typography color="textSecondary" gutterBottom>
								Total Reviews
							</Typography>
							<Typography variant="h5">
								{dashboardData.totalReviews}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Pending Reviews Table */}
			<Paper sx={{ p: 2, mb: 4 }}>
				<Typography variant="h6" gutterBottom>
					Pending Reviews
				</Typography>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>ID</TableCell>
								<TableCell>Type</TableCell>
								<TableCell>Inmate</TableCell>
								<TableCell>Created</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{dashboardData.pendingReviewList.map((request: Request) => (
								<TableRow key={request.id}>
									<TableCell>{request.id}</TableCell>
									<TableCell>{request.requestType}</TableCell>
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

			{/* Recent Activity Table */}
			<Paper sx={{ p: 2 }}>
				<Typography variant="h6" gutterBottom>
					Recent Activity
				</Typography>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Request ID</TableCell>
								<TableCell>Type</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Inmate</TableCell>
								<TableCell>Date</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{dashboardData.recentActivity.map((activity: Request) => (
								<TableRow key={activity.id}>
									<TableCell>{activity.id}</TableCell>
									<TableCell>{activity.requestType}</TableCell>
									<TableCell>{activity.requestStatus}</TableCell>
									<TableCell>{activity.inmateId}</TableCell>
									<TableCell>
										{new Date(activity.createdAt).toLocaleDateString()}
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

export default GuardDashboard; 
