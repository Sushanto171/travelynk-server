import config from "../../config";
import { httpStatus } from "../../helpers/httpStatus";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "../auth/auth.service";
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

const getUserById = catchAsync(async (req, res) => {
  const result = await UserService.getUserById(req.params.id);

  sendResponse(res, {
    success: true,
    message: "User retrieved Successfully",
    statusCode: httpStatus.OK,
    data: result
  })
})

const createTraveler = catchAsync(async (req, res) => {

  const result = await UserService.createTraveler(req.body);

  // verify email
  const password = req.body.password
  const email = req.body.traveler.email

  const token = await AuthService.sendVerificationEmail(email, password,)

  if (token) {
    return res.json({
      redirectTo: `${config.FRONTEND_URL}/verify?email=${email}&token=${token}`
    })
  }
  sendResponse(res, {
    success: true,
    message: "Users Created Successfully",
    statusCode: httpStatus.CREATED,
    data: result
  })
})

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserService.createAdmin(req.body);

  sendResponse(res, {
    success: true,
    message: "Users Created Successfully",
    statusCode: httpStatus.CREATED,
    data: result
  })
})

const updateProfilePhoto = catchAsync(async (req, res) => {
  const result = await UserService.updateProfilePhoto(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile photo updated",
    data: result,
  });
});

const changeProfileStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserService.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Change profile status successfully!",
    data: result,
  });
});

export const UserController = {
  getAllFormDB,
  getUserById,
  createTraveler,
  updateProfilePhoto,
  createAdmin,
  changeProfileStatus
}