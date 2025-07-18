import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import { theme } from './theme';

const queryClient = new QueryClient();

test('renders login page by default', () => {
	render(
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<App />
				</ThemeProvider>
			</QueryClientProvider>
		</BrowserRouter>
	);

	const signInElement = screen.getByText(/sign in/i);
	expect(signInElement).toBeInTheDocument();
});
