import React from 'react';
import {
	Box,
	Container,
	Grid,
	Paper,
	Typography,
	Card,
	CardContent,
	Button,
	Tabs,
	Tab
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { InmateDashboard as InmateDashboardType, isInmateDashboard, DashboardData } from '../types';
import RequestsPage from './RequestsPage';
import OrdersPage from './OrdersPage';

const InmateDashboard: React.FC = () => {
	const navigate = useNavigate();
	const logout = useAuthStore(state => state.logout);
	const user = useAuthStore(state => state.user);
	const [tab, setTab] = React.useState(0);

	const { data: dashboardData, isLoading } = useQuery<DashboardData, Error, InmateDashboardType>({
		queryKey: ['inmateDashboard'],
		queryFn: () => api.getDashboard('inmate'),
		select: (data: DashboardData) => {
			if (!isInmateDashboard(data)) {
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
				<Typography variant="h4">Inmate Dashboard</Typography>
				<Button variant="contained" color="primary" onClick={handleLogout}>
					Logout
				</Button>
			</Box>

			{/* Inmate Info */}
			<Box sx={{ mb: 4 }}>
				<Typography variant="h6">Welcome, {user?.username}</Typography>
			</Box>

			{/* Statistics Cards */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
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
								Pending Requests
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
								Approved Requests
							</Typography>
							<Typography variant="h5">
								{dashboardData.approvedRequests}
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

			{/* Tabs for Home, Requests and Orders */}
			<Paper sx={{ p: 2 }}>
				<Tabs value={tab} onChange={(_, v) => setTab(v)}>
					<Tab label="Home" />
					<Tab label="Requests" />
					<Tab label="Orders" />
				</Tabs>
				<Box sx={{ mt: 2 }}>
					{tab === 0 && (
						<Box>
							<Typography variant="h6" gutterBottom>
								Account Number: {user?.id}
							</Typography>
							<Typography variant="h6" gutterBottom>
								Name: {user?.username}
							</Typography>
							<Typography variant="h6" gutterBottom>
								Device: {user?.device?.serial_number || 'None'}
							</Typography>
						</Box>
					)}
					{tab === 1 && <RequestsPage requests={dashboardData.myRequests} />}
					{tab === 2 && <OrdersPage />}
				</Box>
			</Paper>
		</Container>
	);
};

export default InmateDashboard; 
