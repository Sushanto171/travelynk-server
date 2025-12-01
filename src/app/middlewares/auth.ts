import { NextFunction, Request, Response } from "express";
import config from "../../config";
import { UserRole } from "../../generated/prisma/enums";
import { ApiError } from "../helpers/ApiError";
import { httpStatus } from "../helpers/httpStatus";
import { jwtHelper } from "../helpers/jwt.helper";

export const auth = (...role: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Unauthorized: Access token required"
        );
      }

      const decoded = jwtHelper.verifyToken(
        token,
        config.jwt.JWT_ACCESS_SECRET as string,
        ["HS256"]
      );

      if (role.length && !role.includes(decoded.role)) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "User not eligible for this request."
        );
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  }
}