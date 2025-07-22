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
exports.OrderController = void 0;
const Order_1 = require("../models/Order");
class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
        this.createOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderItem } = req.body;
                const inmateId = req.user.id;
                const order = yield this.orderService.createOrder({
                    inmateId,
                    orderItem
                });
                res.status(201).json(order);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
        this.getOwnOrders = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const inmateId = req.user.id;
                const orders = yield this.orderService.getOrdersByUser(inmateId);
                res.json(orders);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
        this.getAllOrders = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const status = req.query.status;
                const orders = yield this.orderService.getAllOrders(status);
                res.json(orders);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
        this.reviewOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const orderNumber = parseInt(req.params.id);
                const reviewerId = req.user.id;
                const { action, reviewNotes } = req.body;
                let status;
                if (action === 'approve')
                    status = Order_1.OrderStatus.APPROVED;
                else if (action === 'reject')
                    status = Order_1.OrderStatus.DENIED;
                else
                    throw new Error('Invalid action');
                const order = yield this.orderService.reviewOrder(orderNumber, reviewerId, status, reviewNotes);
                res.json(order);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    ;
}
exports.OrderController = OrderController;
