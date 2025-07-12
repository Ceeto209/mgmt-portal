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
exports.RequestController = void 0;
class RequestController {
    constructor(requestService) {
        this.requestService = requestService;
        this.createRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { requestType, description } = req.body;
                const inmateId = req.user.id;
                //const type = req.query.requestType as RequestType; Maybe need to try this, had an issue where submitting a request was always defaulting to OTHER
                const request = yield this.requestService.createRequest({
                    inmateId,
                    requestType,
                    description
                });
                res.status(201).json(request);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
        this.getRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestId = parseInt(req.params.id);
                const request = yield this.requestService.getRequestById(requestId);
                res.json(request);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
        this.getInmateRequests = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const inmateId = req.user.id;
                const requests = yield this.requestService.getInmateRequest(inmateId);
                res.json(requests);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
        this.getAllRequests = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const status = req.query.status;
                const requests = yield this.requestService.getAllRequests(status);
                res.json(requests);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
        this.reviewRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestId = parseInt(req.params.id);
                const { status, reviewNotes } = req.body;
                const reviewerId = req.user.id;
                const request = yield this.requestService.reviewRequest(requestId, reviewerId, status, reviewNotes);
                res.json(request);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
        this.disputeRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestId = parseInt(req.params.id);
                const { disputeReason } = req.body;
                const request = yield this.requestService.disputedRequest(requestId, disputeReason);
                res.json(request);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    ;
}
exports.RequestController = RequestController;
