import httpStatus from "http-status-codes";
import { TGenericErrorTypes,TErrorSource } from "../interface/ErrorTypes";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handlerValidationError = (err: any): TGenericErrorTypes => {
  const error = Object.values(err.errors);
  const errorSource: TErrorSource[] = error.map((field: any) => {
    return { path: field.path, message: field.message };
  });
  return {
    message: "Validation Error",
    statusCode: httpStatus.BAD_REQUEST,
    errorSource,
  };
};
