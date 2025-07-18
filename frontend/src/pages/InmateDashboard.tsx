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
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { InmateDashboard as InmateDashboardType, isInmateDashboard, DashboardData, Request, RequestType } from '../types';

const InmateDashboard: React.FC = () => {
	const navigate = useNavigate();
	const logout = useAuthStore(state => state.logout);
	const [openDialog, setOpenDialog] = React.useState(false);
	const [requestType, setRequestType] = React.useState<RequestType>(RequestType.MEDICAL);
	const [description, setDescription] = React.useState('');

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

	const handleCreateRequest = async () => {
		try {
			await api.createRequest(requestType, description);
			setOpenDialog(false);
			setDescription('');
			// TODO: Refresh dashboard data
		} catch (error) {
			console.error('Failed to create request:', error);
		}
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
					Inmate Dashboard
				</Typography>
				<Button variant="contained" color="primary" onClick={handleLogout}>
					Logout
				</Button>
			</Box>

			<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
				<Button
					variant="contained"
					color="primary"
					onClick={() => setOpenDialog(true)}
				>
					New Request
				</Button>
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

			{/* Recent Requests Table */}
			<Paper sx={{ p: 2 }}>
				<Typography variant="h6" gutterBottom>
					My Requests
				</Typography>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>ID</TableCell>
								<TableCell>Type</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Created</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{dashboardData.myRequests.map((request: Request) => (
								<TableRow key={request.id}>
									<TableCell>{request.id}</TableCell>
									<TableCell>{request.requestType}</TableCell>
									<TableCell>{request.requestStatus}</TableCell>
									<TableCell>
										{new Date(request.createdAt).toLocaleDateString()}
									</TableCell>
									<TableCell>
										{request.requestStatus === 'disputed' && (
											<Button
												variant="contained"
												color="error"
												size="small"
												onClick={() => {/* TODO: Implement dispute action */ }}
											>
												View Dispute
											</Button>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>

			{/* New Request Dialog */}
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogTitle>Create New Request</DialogTitle>
				<DialogContent>
					<TextField
						select
						fullWidth
						label="Request Type"
						value={requestType}
						onChange={(e) => setRequestType(e.target.value as RequestType)}
						margin="normal"
						SelectProps={{
							native: true,
						}}
					>
						<option value="medical">Medical</option>
						<option value="legal">Legal</option>
						<option value="visitation">Visitation</option>
						<option value="tablet">Tablet</option>
						<option value="other">Other</option>
					</TextField>
					<TextField
						fullWidth
						label="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						margin="normal"
						multiline
						rows={4}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>Cancel</Button>
					<Button onClick={handleCreateRequest} color="primary">
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default InmateDashboard; 
