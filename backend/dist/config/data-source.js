"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Request_1 = require("../models/Request");
const User_1 = require("../models/User");
const Device_1 = require("../models/Device");
const DeviceAudit_1 = require("../models/DeviceAudit");
const Order_1 = require("../models/Order");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Request_1.Request, User_1.User, Device_1.Device, DeviceAudit_1.DeviceAudit, Order_1.Order],
    synchronize: true,
    logging: true,
});
