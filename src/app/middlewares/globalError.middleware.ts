/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import config from "../config";
import { fileUploadHelper } from "../helpers/fileUploader";
import { httpStatus } from "../helpers/httpStatus";

const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {

  console.log(config.node_env === "production" ? err.message : err)

  if (req.body) {
    const res = await fileUploadHelper.destroyFileFormCloudinary(req.body.file);
    console.log("destroy", res);
  }
  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      message = "Duplicate key error";
      error = err.meta;
      statusCode = httpStatus.CONFLICT;
    }
    if (err.code === "P1000") {
      message = " Authentication failed against database server";
      error = err.meta;
      statusCode = httpStatus.BAD_GATEWAY;
    }
    if (err.code === "P2003") {
      message = "Foreign key constraint failed on the field";
      error = err.meta;
      statusCode = httpStatus.BAD_REQUEST;
    }
    if (err.code === "P2025") {
      message = "No record was found for a query.";
      error = err.meta;
      statusCode = httpStatus.BAD_REQUEST;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Validation Error";
    error = err.message;
    statusCode = httpStatus.BAD_REQUEST;
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    message = "Unknown Prisma error occurred";
    error = err.message;
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    message = "Prisma client failed to initialize";
    error = err.message;
  }


  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;