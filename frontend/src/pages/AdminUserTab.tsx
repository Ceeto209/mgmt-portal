import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Tab, Tabs, TextField, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { api } from '../api/client';
import { User } from '../types';

const AdminUsersTab: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [open, setOpen] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState('inmate');

	const loadUsers = async () => {
		const data = await api.getUsers();
		setUsers(data);
	};

	useEffect(() => { loadUsers(); }, []);

	const handleAdd = async () => {
		await api.createUser(username, password, role);
		setUsername('');
		setPassword('');
		setRole('inmate');
		setOpen(false);
		loadUsers();
	};

	const handleDelete = async (id: number) => {
		await api.deleteUser(id);
		loadUsers();
	};

	return (
		<Box>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
				<Typography variant="h6">Users</Typography>
				<Button variant="contained" onClick={() => setOpen(true)}>Add User</Button>
			</Box>
			<Paper>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Username</TableCell>
							<TableCell>Role</TableCell>
							<TableCell>Device</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map(u => (
							<TableRow key={u.id}>
								<TableCell>{u.id}</TableCell>
								<TableCell>{u.username}</TableCell>
								<TableCell>{u.role}</TableCell>
								<TableCell>{u.device_id || '-'}</TableCell>
								<TableCell>
									<Button color="error" size="small" onClick={() => handleDelete(Number(u.id))}>Delete</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Paper>
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>New User</DialogTitle>
				<DialogContent>
					<TextField fullWidth label="Username" margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
					<TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
					<TextField select fullWidth label="Role" margin="normal" value={role} onChange={e => setRole(e.target.value)}>
						<MenuItem value="inmate">Inmate</MenuItem>
						<MenuItem value="guard">Guard</MenuItem>
						<MenuItem value="admin">Admin</MenuItem>
					</TextField>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button onClick={handleAdd}>Add</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default AdminUsersTab;
