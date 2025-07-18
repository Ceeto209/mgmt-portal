import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
	palette: {
		primary: {
			main: '#1976d2',
			light: '#42a5f5',
			dark: '#1565c0',
		},
		secondary: {
			main: '#9c27b0',
			light: '#ba68c8',
			dark: '#7b1fa2',
		},
		background: {
			default: '#f5f5f5',
			paper: '#ffffff',
		},
	},
	typography: {
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
		].join(','),
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
				},
			},
		},
	},
});

