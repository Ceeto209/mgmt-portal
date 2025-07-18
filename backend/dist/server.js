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
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const request_routes_1 = require("./routes/request.routes");
const dashboard_routes_1 = require("./routes/dashboard.routes");
const order_routes_1 = require("./routes/order.routes");
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
app.use('/api/auth', auth_routes_1.default);
app.use('/api/requests', (0, request_routes_1.createRequestRoutes)());
app.use('/api/dashboard', (0, dashboard_routes_1.createDashboardRoutes)());
app.use('/api/orders', (0, order_routes_1.createOrderRoutes)());
app.get('/', (req, res) => {
    res.send('Inmate portal API');
});
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
