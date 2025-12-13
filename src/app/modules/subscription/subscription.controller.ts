/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { queryOptions } from "../../constant/queryOptions";
import { httpStatus } from "../../helpers/httpStatus";
import { pick } from "../../helpers/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SubscriptionService } from "./subscription.service";

const createSubscription = catchAsync(async (req, res) => {

  const result = await SubscriptionService.createSubscription(req.user!, req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment successfully",
    data: result,
  });
});

const getAllFormDB = catchAsync(async (req, res) => {

  const filters = pick(req.query, []);
  const options = pick(req.query, queryOptions);


  const { data, meta } = await SubscriptionService.getAllFormDB(filters, options)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subscriptions data retrieved successfully",
    data,
    meta
  });
});

export const SubscriptionController = {
  createSubscription,
  getAllFormDB
}