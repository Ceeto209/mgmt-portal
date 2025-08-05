import React, { useState } from 'react';
import { Box, TextField, MenuItem, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { DeviceWithUser, User } from '../types';

const columns = (
	toggle: (id: string, status: 'active' | 'deactive') => void,
	openAssign: (device: DeviceWithUser) => void,
	removeUser: (id: string) => void
): GridColDef[] => [
		{ field: 'serial_number', headerName: 'Serial', width: 150 },
		{ field: 'role', headerName: 'Role', width: 120 },
		{ field: 'status', headerName: 'Status', width: 120 },
		{
			field: 'assigned',
			headerName: 'Assigned To',
			width: 150,
			valueGetter: params => params.row.user ? params.row.user.username : '-'
		},
		{
			field: 'action',
			headerName: 'Action',
			width: 300,
			renderCell: params => (
				<Box sx={{ display: 'flex', gap: 1 }}>
					<Button
						size="small"
						onClick={() => toggle(params.row.id, params.row.status === 'active' ? 'deactive' : 'active')}
					>
						{params.row.status === 'active' ? 'Deactivate' : 'Activate'}
					</Button>
					{params.row.user ? (
						<Button size="small" onClick={() => removeUser(params.row.id)}>Remove User</Button>
					) : (
						<Button size="small" onClick={() => openAssign(params.row)}>Add User</Button>
					)}
				</Box>
			)
		}
	];

const DeviceTab: React.FC = () => {
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState('all');
	const [page, setPage] = useState(0);
	const [assignInfo, setAssignInfo] = useState<{ id: string; role: string } | null>(null);
	const [selectedUser, setSelectedUser] = useState('');
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery<{ devices: DeviceWithUser[]; total: number }>({
		queryKey: ['devices', search, status, page],
		queryFn: () =>
			api.listDevices({
				search: search || undefined,
				status: status !== 'all' ? status : undefined,
				page: page + 1,
				limit: 10
			})
	});

	const { data: users } = useQuery<User[]>({ queryKey: ['users'], queryFn: api.getUsers });

	const statusMutation = useMutation<void, Error, { id: string; s: 'active' | 'deactive'; reason?: string }>({
		mutationFn: ({ id, s, reason }) => api.updateDeviceStatus(id, s, reason),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['devices'] });
		}
	});

	const assignMutation = useMutation<void, Error, { id: string; userId: number }>({
		mutationFn: ({ id, userId }) => api.assignDeviceUser(id, userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['devices'] });
			setAssignInfo(null);
			setSelectedUser('');
		}
	});

	const removeMutation = useMutation<void, Error, string>({
		mutationFn: id => api.removeDeviceUser(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['devices'] });
		}
	});

	const handleToggle = (id: string, s: 'active' | 'deactive') => {
		statusMutation.mutate({ id, s });
	};

	const handleAssign = () => {
		if (assignInfo && selectedUser) {
			assignMutation.mutate({ id: assignInfo.id, userId: Number(selectedUser) });
		}
	};

	const handleRemoveUser = (id: string) => {
		removeMutation.mutate(id);
	};

	const rows: DeviceWithUser[] = data?.devices || [];
	const total = data?.total || 0;
	const availableUsers = users?.filter(u => !u.device_id && u.role === assignInfo?.role) || [];

	return (
		<Box>
			<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
				<TextField label="Search" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
				<TextField select label="Status" value={status} onChange={e => { setStatus(e.target.value); setPage(0); }} sx={{ width: 150 }}>
					<MenuItem value="all">All</MenuItem>
					<MenuItem value="active">Active</MenuItem>
					<MenuItem value="deactive">Deactive</MenuItem>
				</TextField>
			</Box>
			<DataGrid
				rows={rows}
				columns={columns(handleToggle, d => setAssignInfo({ id: d.id, role: d.role }), handleRemoveUser)}
				getRowId={row => row.id}
				autoHeight
				sx={{ bgcolor: 'background.paper' }}
				loading={
					isLoading ||
					statusMutation.isPending ||
					assignMutation.isPending ||
					removeMutation.isPending
				}
				pageSize={10}
				page={page}
				rowCount={total}
				pagination
				paginationMode="server"
				onPageChange={p => setPage(p)}
			/>
			{(statusMutation.isError || assignMutation.isError || removeMutation.isError) && (
				<Typography color="error">Error updating device</Typography>
			)}
			<Dialog open={!!assignInfo} onClose={() => setAssignInfo(null)}>
				<DialogTitle>Assign User</DialogTitle>
				<DialogContent>
					<TextField
						select
						fullWidth
						label="User"
						value={selectedUser}
						onChange={e => setSelectedUser(e.target.value)}
						margin="normal"
					>
						{availableUsers.map(u => (
							<MenuItem key={u.id} value={u.id.toString()}>
								{u.username}
							</MenuItem>
						))}
					</TextField>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setAssignInfo(null)}>Cancel</Button>
					<Button onClick={handleAssign} disabled={!selectedUser || assignMutation.isPending}>
						Assign
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default DeviceTab;
