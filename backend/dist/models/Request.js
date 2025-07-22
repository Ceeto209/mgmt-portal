"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = exports.RequestType = exports.RequestStatus = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "pending";
    RequestStatus["APPROVED"] = "approved";
    RequestStatus["DENIED"] = "denied";
    RequestStatus["DISPUTED"] = "disputed";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
var RequestType;
(function (RequestType) {
    RequestType["TABLET"] = "tablet";
    RequestType["MEDICAL"] = "medical";
    RequestType["LEGAL"] = "legal";
    RequestType["VISITATION"] = "visitation";
    RequestType["COMMISSARY"] = "commissary";
    RequestType["OTHER"] = "other";
})(RequestType || (exports.RequestType = RequestType = {}));
let Request = class Request {
};
exports.Request = Request;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Request.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Request.prototype, "inmateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'inmateId' }),
    __metadata("design:type", User_1.User)
], Request.prototype, "inmate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RequestType,
        default: RequestType.OTHER
    }),
    __metadata("design:type", String)
], Request.prototype, "requestType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RequestStatus,
        default: RequestStatus.PENDING
    }),
    __metadata("design:type", String)
], Request.prototype, "requestStatus", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Request.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Request.prototype, "reviewedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'reviewedBy' }),
    __metadata("design:type", User_1.User)
], Request.prototype, "reviewer", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Request.prototype, "reviewNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Request.prototype, "disputeReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Request.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Request.prototype, "updatedAt", void 0);
exports.Request = Request = __decorate([
    (0, typeorm_1.Entity)()
], Request);
