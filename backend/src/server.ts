import 'reflect-metadata';
import express from 'express';
import { createServer } from 'http';
import 'dotenv/config';
import cors from 'cors';
import { AppDataSource } from './config/data-source';
import authRoutes from './routes/auth.routes';
import { createRequestRoutes } from './routes/request.routes';
import { createDashboardRoutes } from './routes/dashboard.routes';
import { createOrderRoutes } from './routes/order.routes';

const app = express();
const port = process.env.PORT;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Initialize database connection
AppDataSource.initialize()
	.then(() => {
		console.log('Database connection established');
	})
	.catch((error) => {
		console.error('Error during database initialization:', error);
	});

// Create HTTP server
const server = createServer(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', createRequestRoutes());
app.use('/api/dashboard', createDashboardRoutes());
app.use('/api/orders', createOrderRoutes());


app.get('/', (req, res) => {
	res.send('Inmate portal API');
});

server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
