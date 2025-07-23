import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Request, RequestType, RequestStatus } from '../types';
import { api } from '../api/client';

interface RequestsPageProps {
	requests: Request[];
}

const columns = (onView: (r: Request) => void): GridColDef[] => [
	{ field: 'id', headerName: 'ID', width: 80 },
	{ field: 'requestType', headerName: 'Type', width: 150 },
	{ field: 'requestStatus', headerName: 'Status', width: 120 },
	{ field: 'createdAt', headerName: 'Created', width: 150, valueGetter: (params: { row: Request }) => new Date(params.row.createdAt).toLocaleDateString() },
	{
		field: 'actions',
		headerName: 'Actions',
		width: 150,
		renderCell: (params: any) => (
			<Button variant="outlined" size="small" onClick={() => onView(params.row)}>View</Button>
		),
		sortable: false,
		filterable: false,
	},
];

const RequestsPage: React.FC<RequestsPageProps> = ({ requests: initialRequests }) => {
	const [open, setOpen] = useState(false);
	const [requestType, setRequestType] = useState<RequestType>(RequestType.MEDICAL);
	const [description, setDescription] = useState('');
	const [requests, setRequests] = useState<Request[]>(initialRequests);
	const [loading, setLoading] = useState(false);
	const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
	const [reason, setReason] = useState('');

	//
	React.useEffect(() => {
		setRequests(initialRequests);
	}, [initialRequests]);
	//

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleSubmit = async () => {
		setLoading(true);
		try {
			await api.createRequest(requestType, description);
			const updatedRequests = await api.getMyRequests();
			setRequests(updatedRequests);
			//setOpen(false);
			//setDescription('');
		} catch (e) {
			// handle error
		} finally {
			setOpen(false);
			setDescription('');
			setLoading(false);
		}
	};

	const handleView = (req: Request) => {
		setSelectedRequest(req);
		setReason('');
	};

	const handleCancel = async (id: string) => {
		await api.deleteRequest(id);
		const updated = await api.getMyRequests();
		setRequests(updated);
		setSelectedRequest(null);
	};

	const handleDispute = async (id: string) => {
		await api.disputeRequest(id, reason);
		const updated = await api.getMyRequests();
		setRequests(updated);
		setSelectedRequest(null);
	};

	return (
		<Box sx={{ height: 400, width: '100%' }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
				<Typography variant="h6" gutterBottom>My Requests</Typography>
				<Button variant="contained" onClick={handleOpen}>New Request</Button>
			</Box>
			<DataGrid
				rows={requests}
				columns={columns(handleView)}
				getRowId={(row) => row.id}
				initialState={{ pagination: { pageSize: 5 } }}
				pagination
				autoHeight
				onRowDoubleClick={(params) => handleView(params.row as Request)}
			/>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Create New Request</DialogTitle>
				<DialogContent>
					<TextField
						select
						fullWidth
						label="Request Type"
						value={requestType}
						onChange={e => setRequestType(e.target.value as RequestType)}
						margin="normal"
					>
						{Object.values(RequestType).map((type) => (
							<MenuItem key={type} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</MenuItem>
						))}
					</TextField>
					<TextField
						fullWidth
						label="Description"
						value={description}
						onChange={e => setDescription(e.target.value)}
						margin="normal"
						multiline
						rows={4}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleSubmit} color="primary" disabled={loading}>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={selectedRequest !== null} onClose={() => setSelectedRequest(null)}>
				<DialogTitle>Request Details</DialogTitle>
				<DialogContent>
					<Typography>ID: {selectedRequest?.id}</Typography>
					<Typography>Type: {selectedRequest?.requestType}</Typography>
					<Typography>Status: {selectedRequest?.requestStatus}</Typography>
					<Typography sx={{ mt: 2 }}>{selectedRequest?.description}</Typography>
					{selectedRequest?.requestStatus === RequestStatus.DENIED && (
						<TextField
							fullWidth
							label="Dispute Reason"
							value={reason}
							onChange={e => setReason(e.target.value)}
							margin="normal"
						/>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setSelectedRequest(null)}>Close</Button>
					{selectedRequest && selectedRequest.requestStatus === RequestStatus.PENDING && (
						<Button color="error" onClick={() => handleCancel(String(selectedRequest.id))}>Cancel Request</Button>
					)}
					{selectedRequest && (
						<Button
							onClick={() => handleDispute(String(selectedRequest.id))}
							disabled={selectedRequest.requestStatus !== RequestStatus.DENIED}
						>
							Dispute
						</Button>
					)}
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default RequestsPage; 
