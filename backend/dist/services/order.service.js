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
}
exports.OrderService = OrderService;
