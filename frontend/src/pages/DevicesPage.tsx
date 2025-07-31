import React, { useState } from 'react';
import { Box, TextField, MenuItem, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { DeviceWithUser } from '../types';

const columns = (toggle: (id: string, status: 'active' | 'deactive') => void): GridColDef[] => [
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
		width: 150,
		renderCell: params => (
			<Button
				size="small"
				onClick={() => toggle(params.row.id, params.row.status === 'active' ? 'deactive' : 'active')}
			>
				{params.row.status === 'active' ? 'Deactivate' : 'Activate'}
			</Button>
		)
	}
];

const DeviceTab: React.FC = () => {
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState('all');
	const [page, setPage] = useState(0);
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

	const mutation = useMutation<
		void,
		Error,
		{ id: string; s: 'active' | 'deactive'; reason?: string }>({
			mutationFn: ({ id, s, reason }) => api.updateDeviceStatus(id, s, reason),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['devices'] });
			}
		});

	const handleToggle = (id: string, s: 'active' | 'deactive') => {
		mutation.mutate({ id, s });
	};

	const rows: DeviceWithUser[] = data?.devices || [];
	const total = data?.total || 0;

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
				columns={columns(handleToggle)}
				getRowId={row => row.id}
				autoHeight
				loading={isLoading || mutation.isPending}
				pageSize={10}
				page={page}
				rowCount={total}
				pagination
				paginationMode="server"
				onPageChange={p => setPage(p)}
			/>
			{mutation.isError && (
				<Typography color="error">Error updating device</Typography>
			)}
		</Box>
	);
};

export default DeviceTab;
