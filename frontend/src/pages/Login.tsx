import React from 'react';
import {
	Container,
	Box,
	Typography,
	TextField,
	Button,
	Paper,
	Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const Login: React.FC = () => {
	const navigate = useNavigate();
	const login = useAuthStore((state) => state.login);
	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		try {
			const response = await login(username, password);
			// Navigate based on user role
			switch (response.user.role) {
				case 'admin':
					navigate('/admin');
					break;
				case 'guard':
					navigate('/guard');
					break;
				case 'inmate':
					navigate('/dashboard');
					break;
				default:
					navigate('/');
			}
		} catch (err) {
			setError('Invalid username or password');
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Paper
					elevation={3}
					sx={{
						padding: 4,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						width: '100%',
					}}
				>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					{error && (
						<Alert severity="error" sx={{ mt: 2, width: '100%' }}>
							{error}
						</Alert>
					)}
					<Box
						component="form"
						onSubmit={handleSubmit}
						sx={{ mt: 1, width: '100%' }}
					>
						<TextField
							margin="normal"
							required
							fullWidth
							id="username"
							label="Username"
							name="username"
							autoComplete="username"
							autoFocus
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign In
						</Button>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
};

export default Login; 
