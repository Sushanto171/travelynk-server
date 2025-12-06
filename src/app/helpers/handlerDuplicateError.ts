/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { TGenericErrorTypes } from "../interface/ErrorTypes";

export const handlerDuplicateError = (err: any): TGenericErrorTypes => {
  const matchedArray = err.errmsg.match(/"([^"]*)"/);
  const message = `${matchedArray[1]} is already exist.`;
  return {
    statusCode: httpStatus.CONFLICT,
    message,
  };
};
