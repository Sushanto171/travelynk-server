/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { httpStatus } from "../../helpers/httpStatus";
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

export const SubscriptionController = {
  createSubscription
}