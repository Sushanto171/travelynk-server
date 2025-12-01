import { httpStatus } from "../../helpers/httpStatus";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

const getAllFormDB = catchAsync(async (req, res) => {
  const result = await UserService.getAllFromDB();

  sendResponse(res, {
    success: true,
    message: "Retrieved All Users Successfully",
    statusCode: httpStatus.OK,
    data: result
  })
})

const createTraveler = catchAsync(async (req, res) => {

  const result = await UserService.createTraveler(req.body);

  sendResponse(res, {
    success: true,
    message: "Users Created Successfully",
    statusCode: httpStatus.CREATED,
    data: result
  })
})

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserService.createAdmin();

  sendResponse(res, {
    success: true,
    message: "Users Created Successfully",
    statusCode: httpStatus.CREATED,
    data: result
  })
})

export const UserController = {
  getAllFormDB,
  createTraveler,
  createAdmin
}