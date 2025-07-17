"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDashboardRoutes = void 0;
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const dashboard_service_1 = require("../services/dashboard.service");
const createDashboardRoutes = () => {
    const router = (0, express_1.Router)();
    const dashboardService = new dashboard_service_1.DashboardService();
    const dashboardController = new dashboard_controller_1.DashboardController(dashboardService);
    router.get('/', (0, auth_middleware_1.authMiddleware)(), dashboardController.getDashboard);
    return router;
};
exports.createDashboardRoutes = createDashboardRoutes;
