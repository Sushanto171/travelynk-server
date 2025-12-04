
import { queryOptions } from "../../constant/queryOptions";
import { httpStatus } from "../../helpers/httpStatus";
import { pick } from "../../helpers/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { adminFilterableFields } from "./admin.constant";
import { adminService } from "./admin.service";

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, queryOptions);

  const result = await adminService.getAllFromDB(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admins data fetched successfully",
    data: result.result,
    meta: result.meta,
  });
});

const updateIntoDB = catchAsync(async (req, res) => {
  const result = await adminService.updateIntoDB(req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin data updated successfully",
    data: result,
  });
});

const getById = catchAsync(async (req, res) => {
  const result = await adminService.getById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin data retrieved successfully",
    data: result,
  });
});

const softDeleteById = catchAsync(async (req, res) => {
  const result = await adminService.softDeleteById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin soft deleted successfully",
    data: result,
  });
});

export const adminController = {
  getAllFromDB,
  updateIntoDB,
  getById,
  softDeleteById,
};
