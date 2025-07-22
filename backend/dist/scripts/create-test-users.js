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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../config/data-source");
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
function createTestUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        yield data_source_1.AppDataSource.initialize();
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const users = [
            ...Array.from({ length: 5 }, (_, i) => ({
                username: `inmate${i + 1}`,
                password: 'password',
                role: 'inmate',
            })),
            { username: 'guard1', password: '123456', role: 'guard' },
            { username: 'admin1', password: '123456', role: 'admin' },
        ];
        for (const user of users) {
            const exists = yield userRepository.findOne({ where: { username: user.username } });
            if (exists) {
                console.log(`User ${user.username} already exists, skipping.`);
                continue;
            }
            const hashedPassword = yield bcrypt_1.default.hash(user.password, 10);
            const newUser = userRepository.create({
                username: user.username,
                password: hashedPassword,
                role: user.role,
            });
            yield userRepository.save(newUser);
            console.log(`Created user: ${user.username} (${user.role})`);
        }
        console.log('\nTest user credentials:');
        for (const user of users) {
            console.log(`Username: ${user.username} | Password: ${user.password} | Role: ${user.role}`);
        }
        yield data_source_1.AppDataSource.destroy();
    });
}
createTestUsers().catch((err) => {
    console.error('Error creating test users:', err);
});
