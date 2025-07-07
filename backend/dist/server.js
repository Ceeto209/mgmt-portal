"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./config/data-source");
//import authRoutes from './routes/auth.routes';
//import { createRequestRoutes } from './routes/request.routes';
//import { createDashboardRoutes } from './routes/dashboard.routes';
const app = (0, express_1.default)();
const port = process.env.PORT;
// Enable CORS for all routes
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize database connection
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('Database connection established');
})
    .catch((error) => {
    console.error('Error during database initialization:', error);
});
// Create HTTP server
const server = (0, http_1.createServer)(app);
// Routes
/*app.use('/api/auth', authRoutes);
app.use('/api/requests', createRequestRoutes(wsService));
app.use('/api/dashboard', createDashboardRoutes());
*/
app.get('/', (req, res) => {
    res.send('Inmate portal API');
});
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
