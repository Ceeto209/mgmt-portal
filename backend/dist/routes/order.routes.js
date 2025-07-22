"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderRoutes = void 0;
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const order_service_1 = require("../services/order.service");
const createOrderRoutes = () => {
    const router = (0, express_1.Router)();
    const orderService = new order_service_1.OrderService();
    const orderController = new order_controller_1.OrderController(orderService);
    router.post('/', (0, auth_middleware_1.authMiddleware)(['inmate']), orderController.createOrder);
    router.get('/my-orders', (0, auth_middleware_1.authMiddleware)(['inmate']), orderController.getOwnOrders);
    router.get('/', (0, auth_middleware_1.authMiddleware)(['guard', 'admin']), orderController.getAllOrders);
    router.patch('/:id/review', (0, auth_middleware_1.authMiddleware)(['guard', 'admin']), orderController.reviewOrder);
    return router;
};
exports.createOrderRoutes = createOrderRoutes;
