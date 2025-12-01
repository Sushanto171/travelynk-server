import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
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
  logout
}