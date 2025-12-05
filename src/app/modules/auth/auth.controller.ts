/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import config from "../../config";
import { ApiError } from "../../helpers/ApiError";
import { httpStatus } from "../../helpers/httpStatus";
import { jwtHelper } from "../../helpers/jwt.helper";
import { setCookie } from "../../helpers/setCookie";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const credentialLogin = catchAsync(async (req, res, next) => {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passport.authenticate("local", { session: false }, async (err: any, user: any, info: any) => {
    if (err) {

      // forcefully email verification
      if (Array.isArray(err) && err[0] === "User is not verified" && err[1]) {
        await AuthService.sendVerificationEmail(err[1])
        return res.redirect(`${config.FRONTEND_URL}/verify?email=${err[1]}`)
      }

      return next(new ApiError(err.statusCode || 401, err));
    }
    if (!user) {
      return next(new ApiError(err.statusCode || 401, info.message));
    }

    const tokens = jwtHelper.getTokens(user as JwtPayload)

    setCookie(res, tokens)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User login successfully.",
      data: user,
    });
  })(req, res, next);
});

const getMe = catchAsync(async (req, res) => {

  const result = await AuthService.getMe(req.user as JwtPayload)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User data retrieved successfully.",
    data: result,
  });

});

const verify = catchAsync(async (req, res) => {
  const token = req.query.token
  await AuthService.verify(req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Verified successfully",
    data: {token},
  });
});

const forgotPassword = catchAsync(async (req, res) => {


  await AuthService.forgotPassword(req.params.email)

  // res.redirect(`${config.FRONTEND_URL}/reset?email=${req.params.email}`)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "OTP send to email",
    data: null,
  });
});


const resetPassword = catchAsync(async (req, res) => {
  const result = await AuthService.resetPassword(req.params.email, req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await AuthService.changePassword(req.user!, req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: result,
  });
});

const logout = catchAsync(async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Logout successfully",
    data: null,
  });
});

export const AuthController = {
  credentialLogin,
  getMe,
  logout,
  verify,
  // getOTP,
  forgotPassword,
  resetPassword,
  changePassword,
}