import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AdminService } from "./admin.service";


const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.create(req.body);
    sendResponse(res, {
        statusCode: 200,
        message: 'Successfully Admin Created !!',
        success: true,
        data: result
    })
})

const getAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getAdmin(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        message: 'Successfully Retrieve Admin !!',
        success: true,
        data: result,
    })
})

// const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const result = await AdminService.getSingleAdmin(id);
//     sendResponse<IAdmin>(res, {
//         statusCode: 200,
//         message: 'Successfully Get Single Admin !!',
//         success: true,
//         data: result,
//     })
// })

// const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;
//     await AdminService.deleteAdmin(id);
//     sendResponse<IAdmin>(res, {
//         statusCode: 200,
//         message: 'Successfully Deleted Admin !!',
//         success: true,
//     })
// })

// const updateAdmin = catchAsync(async (req: Request, res: Response) => {
//     const { ...adminInfo } = req.body;
//     const { id } = req.params;
//     const result = await AdminService.updateAdmin(id, adminInfo);
//     sendResponse<IAdmin>(res, {
//         statusCode: 200,
//         message: 'Successfully Updated Admin informations !!',
//         success: true,
//         data: result,
//     })
// })

export const AdminController = {
    getAdmin,
    createAdmin
}