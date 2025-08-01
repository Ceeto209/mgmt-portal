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
	Tabs,
	Tab,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	MenuItem,
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { AdminDashboard as AdminDashboardType, isAdminDashboard, DashboardData, Request, RequestStatus, Order, OrderStatus, OrderType, Device } from '../types';
import AdminUsersTab from './AdminUserTab';
import DeviceTab from './DevicesPage';

const AdminDashboard: React.FC = () => {
	const navigate = useNavigate();
	const logout = useAuthStore(state => state.logout);
	const user = useAuthStore(state => state.user);
	const queryClient = useQueryClient();
	const [tab, setTab] = React.useState(0);
	const [reviewDialog, setReviewDialog] = React.useState<{ order: Order | null; action: 'approve' | 'reject' }>({ order: null, action: 'approve' });
	const [devices, setDevices] = React.useState<Device[]>([]);
	const [selectedDevice, setSelectedDevice] = React.useState('');

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
		queryFn: () => api.getAllOrders(),
	});

	const pendingOrders = ordersData?.filter(o => o.orderStatus === OrderStatus.PENDING) || [];
	const reviewedOrders = ordersData?.filter(o => o.orderStatus !== OrderStatus.PENDING) || [];

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const handleReview = async (id: string, status: RequestStatus) => {
		await api.reviewRequests(id, status);
		queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
	};

	const handleOrderReview = async (id: string, action: 'approve' | 'reject') => {
		const order = ordersData?.find(o => String(o.orderNumber) === id) || null;
		let deviceList: Device[] = [];
		if (
			action === 'approve' &&
			order &&
			(order.orderItem === OrderType.TABLET || order.orderItem === OrderType.DEVICE)
		) {
			deviceList = await api.getAvailableDevices(order.orderUser.role);
		}
		setDevices(deviceList);
		setSelectedDevice('');
		setReviewDialog({ order, action });
	};

	const confirmOrderReview = async () => {
		if (!reviewDialog.order) return;
		const deviceId =
			reviewDialog.action === 'approve' && selectedDevice ? selectedDevice : undefined;
		await api.reviewOrder(
			String(reviewDialog.order.orderNumber),
			reviewDialog.action,
			undefined,
			deviceId
		);
		setReviewDialog({ order: null, action: 'approve' });
		queryClient.invalidateQueries({ queryKey: ['allOrders'] });
		queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
	};

	const needsDevice = reviewDialog.action === 'approve' && (reviewDialog.order?.orderItem === OrderType.TABLET || reviewDialog.order?.orderItem === OrderType.DEVICE);

	if (isLoading) {
		return <Typography>Loading...</Typography>;
	}

	if (!dashboardData) {
		return <Typography>No data available</Typography>;
	}

	return (
		<>
			<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
					<Typography variant="h4">
						Admin Dashboard
					</Typography>
					<Button variant="contained" color="primary" onClick={handleLogout}>
						Logout
					</Button>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography variant="h6">Welcome, {user?.username}</Typography>
				</Box>

				<Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 4 }}>
					<Tab label="Home" />
					<Tab label="Users" />
					<Tab label="Devices" />
					<Tab label="Reviewed Orders" />
				</Tabs>

				{tab === 0 && (
					<>
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
											<TableCell>Description</TableCell>
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
												<TableCell>{request.description}</TableCell>
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

						{/* Pending Orders Table */}
						<Paper sx={{ p: 2, mt: 4 }}>
							<Typography variant="h6" gutterBottom>
								Pending Orders
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
										{pendingOrders.map((order: Order) => (
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
					</>
				)}
				{tab === 1 && <AdminUsersTab />}
				{tab === 2 && <DeviceTab />}
				{tab === 3 && (
					<Paper sx={{ p: 2 }}>
						<Typography variant="h6" gutterBottom>
							Reviewed Orders
						</Typography>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>#</TableCell>
										<TableCell>Item</TableCell>
										<TableCell>Status</TableCell>
										<TableCell>Inmate</TableCell>
										<TableCell>Reviewed</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{reviewedOrders.map((order: Order) => (
										<TableRow key={order.orderNumber}>
											<TableCell>{order.orderNumber}</TableCell>
											<TableCell>{order.orderItem}</TableCell>
											<TableCell>{order.orderStatus}</TableCell>
											<TableCell>{order.inmateId}</TableCell>
											<TableCell>{new Date(order.orderUpdatedDate).toLocaleDateString()}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				)}
			</Container>

			<Dialog open={Boolean(reviewDialog.order)} onClose={() => setReviewDialog({ order: null, action: 'approve' })}>
				<DialogTitle>{needsDevice ? 'Assign Device' : 'Review Order'}</DialogTitle>
				<DialogContent>
					{needsDevice ? (
						devices.length === 0 ? (
							<Typography>No available devices</Typography>
						) : (
							<TextField select fullWidth label="Device" value={selectedDevice} onChange={e => setSelectedDevice(e.target.value)} margin="normal">
								{devices.map(d => (
									<MenuItem key={d.id} value={d.id}>{d.serial_number}</MenuItem>
								))}
							</TextField>
						)
					) : (
						<Typography>Are you sure?</Typography>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setReviewDialog({ order: null, action: 'approve' })}>Cancel</Button>
					<Button onClick={confirmOrderReview} disabled={needsDevice && devices.length === 0}>Confirm</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
export default AdminDashboard; 
