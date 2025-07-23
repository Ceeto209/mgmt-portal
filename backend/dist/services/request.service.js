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
exports.RequestService = void 0;
const data_source_1 = require("../config/data-source");
const Request_1 = require("../models/Request");
const User_1 = require("../models/User");
class RequestService {
    constructor() {
        this.requestRepository = data_source_1.AppDataSource.getRepository(Request_1.Request);
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    createRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const inmate = yield this.userRepository.findOne({ where: { id: data.inmateId } });
            if (!inmate) {
                throw new Error('Inmate not found');
            }
            const request = this.requestRepository.create(Object.assign(Object.assign({}, data), { requestStatus: Request_1.RequestStatus.PENDING }));
            const savedRequest = yield this.requestRepository.save(request);
            return savedRequest;
        });
    }
    getRequestById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield this.requestRepository.findOne({
                where: { id },
                relations: ['inmate', 'reviewer']
            });
            if (!request) {
                throw new Error('Request not found.');
            }
            return request;
        });
    }
    getInmateRequest(inmateId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestRepository.find({
                where: { inmateId },
                relations: ['reviewer'],
                order: { createdAt: 'DESC' }
            });
        });
    }
    getAllRequests(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = status ? { requestStatus: status } : {};
            return yield this.requestRepository.find({
                where,
                relations: ['inmate', 'reviewer'],
                order: { createdAt: 'DESC' }
            });
        });
    }
    reviewRequest(requestId, reviewerId, status, reviewNotes) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield this.getRequestById(requestId);
            const reviewer = yield this.userRepository.findOne({ where: { id: reviewerId } });
            if (!reviewer) {
                throw new Error('Reviewer not found');
            }
            if (request.requestStatus !== Request_1.RequestStatus.PENDING && request.requestStatus !== Request_1.RequestStatus.DISPUTED) {
                throw new Error('Request cannot be reviewed in its current state');
            }
            request.requestStatus = status;
            request.reviewedBy = reviewerId;
            request.reviewNotes = reviewNotes;
            const updatedRequest = yield this.requestRepository.save(request);
            return updatedRequest;
        });
    }
    disputedRequest(requestId, disputeReason) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield this.getRequestById(requestId);
            if (request.requestStatus !== Request_1.RequestStatus.DENIED) {
                throw new Error('Only denied request can be disputed');
            }
            request.requestStatus = Request_1.RequestStatus.DISPUTED;
            request.disputeReason = disputeReason;
            const updateRequest = yield this.requestRepository.save(request);
            return updateRequest;
        });
    }
    deleteRequest(requestId, inmateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield this.getRequestById(requestId);
            if (request.inmateId !== inmateId) {
                throw new Error('Not authorized to delete this request');
            }
            if (request.requestStatus === Request_1.RequestStatus.DENIED || request.requestStatus === Request_1.RequestStatus.DISPUTED) {
                throw new Error('Cannot delete a request that is denied or disputed');
            }
            yield this.requestRepository.remove(request);
        });
    }
}
exports.RequestService = RequestService;
