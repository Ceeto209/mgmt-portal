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
exports.OrderService = void 0;
const data_source_1 = require("../config/data-source");
const Order_1 = require("../models/Order");
const User_1 = require("../models/User");
class OrderService {
    constructor() {
        this.orderRepository = data_source_1.AppDataSource.getRepository(Order_1.Order);
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    createOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const inmate = yield this.userRepository.findOne({ where: { id: data.inmateId } });
            if (!inmate) {
                throw new Error('Inmate not found');
            }
            const order = this.orderRepository.create(Object.assign(Object.assign({}, data), { orderStatus: Order_1.OrderStatus.PENDING }));
            const savedOrder = yield this.orderRepository.save(order);
            return savedOrder;
        });
    }
    getOrderById(orderNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.orderRepository.findOne({
                where: { orderNumber },
                relations: ['orderUser', 'reviewer']
            });
            if (!order) {
                throw new Error('Order not found.');
            }
            return order;
        });
    }
    getOrdersByUser(inmateId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderRepository.find({
                where: { inmateId },
                relations: ['orderUser', 'reviewer'],
                order: { orderCreatedDate: 'DESC' }
            });
        });
    }
    getAllOrders(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = status ? { orderStatus: status } : {};
            return yield this.orderRepository.find({
                where,
                relations: ['orderUser', 'reviewer'],
                order: { orderCreatedDate: 'DESC' }
            });
        });
    }
    reviewOrder(orderNumber, reviewerId, status, reviewNotes) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.getOrderById(orderNumber);
            const reviewer = yield this.userRepository.findOne({ where: { id: reviewerId } });
            if (!reviewer) {
                throw new Error('Reviewer not found');
            }
            if (order.orderStatus !== Order_1.OrderStatus.PENDING && order.orderStatus !== Order_1.OrderStatus.DISPUTED) {
                throw new Error('Order cannot be reviewed in its current state');
            }
            order.orderStatus = status;
            order.reviewedBy = reviewerId;
            order.reviewNotes = reviewNotes;
            const updatedOrder = yield this.orderRepository.save(order);
            return updatedOrder;
        });
    }
}
exports.OrderService = OrderService;
