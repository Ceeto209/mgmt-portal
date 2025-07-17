"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const data_source_1 = require("../config/data-source");
const Request_1 = require("../models/Request");
const User_1 = require("../models/User");
const Order_1 = require("../models/Order");
const Device_1 = require("../models/Device");
class DashboardService {
    constructor() {
        this.requestRepository = data_source_1.AppDataSource.getRepository(Request_1.Request);
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        this.orderRepository = data_source_1.AppDataSource.getRepository(Order_1.Order);
        this.deviceRepository = data_source_1.AppDataSource.getRepository(Device_1.Device);
    }
    getInmateDashboard(inmateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = yield this.requestRepository.find({
                where: { inmateId },
                relations: ['reviwer'],
                order: { createdAt: 'DESC' }
            });
            return {
                activeRequests: requests.filter(r => r.requestStatus === Request_1.RequestStatus.PENDING).length,
                pendingReviews: requests.filter(r => r.requestStatus === Request_1.RequestStatus.PENDING).length,
                disputedRequest: requests.filter(r => r.requestStatus === Request_1.RequestStatus.DISPUTED).length,
                approvedRequests: requests.filter(r => r.requestStatus === Request_1.RequestStatus.APPROVED).length,
                myRequests: requests.slice(0, 5)
            };
        });
    }
    getGuardDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = yield this.requestRepository.find({
                relations: ['inmate'],
                order: { createdAt: 'DESC' }
            });
            const pendingRequests = requests.filter(r => r.requestStatus === Request_1.RequestStatus.PENDING);
            const disputedRequests = requests.filter(r => r.requestStatus === Request_1.RequestStatus.DISPUTED);
            return {
                activeRequests: pendingRequests.length, // requests.filter(r => r.requestStatus === RequestStatus.PENDING).length,
                pendingRequests: pendingRequests.length,
                disputedRequests: disputedRequests.length,
                totalReviews: requests.length,
                pendingReviewList: pendingRequests.slice(0, 10),
                recentActivity: requests.slice(0, 10)
            };
        });
    }
    getAdminDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            const [requests, users, orders, devices] = yield Promise.all([
                this.requestRepository.find({
                    relations: ['inmate', 'reviewer'],
                    order: { createdAt: 'DESC' }
                }),
                this.userRepository.find(),
                this.orderRepository.find(),
                this.deviceRepository.find()
            ]);
            const pendingRequests = requests.filter(r => r.requestStatus === Request_1.RequestStatus.PENDING);
            const disputedRequests = requests.filter(r => r.requestStatus === Request_1.RequestStatus.DISPUTED);
            return {
                activeRequests: pendingRequests.length,
                pendingRequests: pendingRequests.length,
                disputedRequests: disputedRequests.length,
                totalUsers: users.length,
                recentRequests: requests.slice(0, 10),
                userStats: {
                    total: users.length,
                    inmates: users.filter(u => u.role === 'inmate').length,
                    guards: users.filter(u => u.role === 'guard').length,
                    admins: users.filter(u => u.role === 'admin').length
                },
                requestStats: {
                    total: requests.length,
                    pending: pendingRequests.length,
                    approved: requests.filter(r => r.requestStatus === Request_1.RequestStatus.APPROVED).length,
                    rejected: requests.filter(r => r.requestStatus === Request_1.RequestStatus.DENIED).length
                },
                orderStats: {
                    total: orders.length,
                    pending: orders.filter(o => o.orderStatus === Order_1.OrderStatus.PENDING).length,
                    approved: orders.filter(o => o.orderStatus === Order_1.OrderStatus.APPROVED).length,
                    denied: orders.filter(o => o.orderStatus === Order_1.OrderStatus.DENIED).length
                },
                deviceStats: {
                    total: devices.length,
                    activeDevices: devices.filter(d => d.status === 'active').length,
                    deactiveDevices: devices.filter(d => d.status === 'deactive').length
                }
            };
        });
    }
}
exports.DashboardService = DashboardService;
