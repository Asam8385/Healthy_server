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
exports.AuthController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const auth_service_1 = require("./auth.service");
const config_1 = __importDefault(require("../../../config"));
const path_1 = __importDefault(require("path"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const Login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.loginUser(req.body);
    const { accessToken } = result;
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true
    };
    res.cookie('accessToken', accessToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: 'Successfully Logged !!',
        success: true,
        data: result,
    });
}));
const ResetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.ResetPassword(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: 'Successfully Passwrod Reset!!',
        success: true,
        data: result,
    });
}));
const PasswordResetConfirm = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.PassworResetConfirm(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: 'Successfully Passwrod Changed!!',
        success: true,
        data: result,
    });
}));
const VerifyUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const isUserExist = yield prisma_1.default.doctor.findUnique({
            where: {
                id: userId
            }
        });
        if (!isUserExist) {
            throw new apiError_1.default(http_status_1.default.NOT_FOUND, "User is not found !!");
        }
        const getVerficationUser = yield prisma_1.default.userVerfication.findFirst({
            where: {
                userId: userId
            }
        });
        if (getVerficationUser) {
            yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                yield tx.doctor.update({
                    where: {
                        id: isUserExist.id
                    },
                    data: {
                        verified: true
                    }
                });
                yield tx.userVerfication.delete({
                    where: {
                        id: getVerficationUser.id
                    }
                });
            }));
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                message: 'Successfully doctor is Verified!!',
                success: true,
            });
        }
    }
    catch (error) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Internal Server Error" + error);
    }
}));
const Count = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docCount = yield prisma_1.default.doctor.count();
        const appointmentCount = yield prisma_1.default.appointments.count();
        const patientCount = yield prisma_1.default.patient.count();
        const doctors = yield prisma_1.default.doctor.findMany();
        const appointments = yield prisma_1.default.appointments.findMany();
        const patients = yield prisma_1.default.patient.findMany();
        const data = {
            docCount,
            appointmentCount,
            patientCount,
            doctors,
            appointments,
            patients
        };
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            message: 'ok!!',
            success: true,
            data: data
        });
    }
    catch (error) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Internal Server Error" + error);
    }
}));
const Verified = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, "../../../../template/verfied.html"));
}));
exports.AuthController = {
    Login,
    VerifyUser,
    Count,
    Verified,
    ResetPassword,
    PasswordResetConfirm
};
