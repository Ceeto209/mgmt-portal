"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequestRoutes = void 0;
const express_1 = require("express");
const request_controller_1 = require("../controllers/request.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const request_service_1 = require("../services/request.service");
const createRequestRoutes = () => {
    const router = (0, express_1.Router)();
    const requestService = new request_service_1.RequestService();
    const requestController = new request_controller_1.RequestController(requestService);
    //inmate routes
    router.post('/', (0, auth_middleware_1.authMiddleware)(['inmate']), requestController.createRequest);
    router.get('/my-requests', (0, auth_middleware_1.authMiddleware)(['inmate']), requestController.getInmateRequests);
    router.get('/:id', (0, auth_middleware_1.authMiddleware)(['inmate', 'guard', 'admin']), requestController.getRequest);
    router.post('/:id/dispute', (0, auth_middleware_1.authMiddleware)(['inmate']), requestController.disputeRequest);
    // admin, gaurd routes
    router.get('/', (0, auth_middleware_1.authMiddleware)(['guard', 'admin']), requestController.getAllRequests);
    router.post('/:id/review', (0, auth_middleware_1.authMiddleware)(['guard', 'admin']), requestController.reviewRequest);
    return router;
};
exports.createRequestRoutes = createRequestRoutes;
