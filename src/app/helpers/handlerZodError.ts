/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { TErrorSource, TGenericErrorTypes } from "../interface/ErrorTypes";

export const handlerZodError = (err: any): TGenericErrorTypes  => {
  const issues = Object.values(err.issues);

  const errorSource: TErrorSource[] = issues.map((issue: any) => {
    let state = "";
    issue.path.forEach((element: string) => {
      state += element + " inside ";
    });
    state = state.endsWith(" inside ") ? state.slice(0, state.length - 8) : "";
    return {
      path: state,
      message: issue.message,
    };
  });
  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Validation Error",
    errorSource,
  };
};
