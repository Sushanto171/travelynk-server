/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import { ApiError } from "../helpers/ApiError";
import { fileUploadHelper } from "../helpers/fileUploader";
import { handlerCastError } from "../helpers/handlerCastError";
import { handlerDuplicateError } from "../helpers/handlerDuplicateError";
import { handlerValidationError } from "../helpers/handlerValidationError";
import { handlerZodError } from "../helpers/handlerZodError";
import { httpStatus } from "../helpers/httpStatus";
import { TErrorSource } from "../interface/ErrorTypes";

const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {

  // console.log(config.node_env === "production" ? err.message : err)
  console.log(err);

  if (req.body) {
    const res = await fileUploadHelper.destroyFileFormCloudinary(req);
    console.log("destroy", res);
  }
  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  // prisma
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

  // zod
  // castError
  if (err.name === "CastError") {
    console.log("cast");
    const simplifiedError = handlerCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Zod error
  else if (err.name === "ZodError") {
    const simplifiedError = handlerZodError(err);
    message = simplifiedError.message;
    statusCode = simplifiedError.statusCode;
    error = simplifiedError.errorSource as TErrorSource[];
  }
  // validation error
  else if (err.name === "ValidationError") {
    console.log("validationError");
    const simplifiedError = handlerValidationError(err);
    message = simplifiedError.message;
    statusCode = simplifiedError.statusCode;
    error = simplifiedError.errorSource as TErrorSource[];
  }
  // duplicate error
  else if (err.code === 11000) {
    const simplifiedError = handlerDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } 
  // else if (err instanceof ApiError) {
  //   statusCode = err.statusCode;
  //   message = err.message;
  // } else if (err instanceof Error) {
  //   statusCode = 500;
  //   message = err.message;
  // }

  console.log({
    success,
    message,
    error,
  });

  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;