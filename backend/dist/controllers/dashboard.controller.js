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
exports.DashboardController = void 0;
class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
        this.getDashboard = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const userRole = req.user.role;
                let dashboardData;
                switch (userRole) {
                    case 'inmate':
                        dashboardData = yield this.dashboardService.getInmateDashboard(userId);
                        break;
                    case 'guard':
                        dashboardData = yield this.dashboardService.getGuardDashboard();
                        break;
                    case 'admin':
                        dashboardData = yield this.dashboardService.getAdminDashboard();
                        break;
                    default:
                        res.status(403).json({ message: 'Invalid Role' });
                        return;
                }
                res.json(dashboardData);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.DashboardController = DashboardController;
