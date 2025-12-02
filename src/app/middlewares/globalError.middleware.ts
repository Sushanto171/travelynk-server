/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { fileUploadHelper } from "../helpers/fileUploader";
import { httpStatus } from "../helpers/httpStatus";

const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const success = false;
  const message = err.message || "Something went wrong!";
  const error = err;
  if (req.body) {
    await fileUploadHelper.destroyFileFormCloudinary(req)
  }
  console.log(err);
  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;