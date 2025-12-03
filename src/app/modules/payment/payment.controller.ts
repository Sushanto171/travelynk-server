import { stripe } from "../../config/stripe.config";
import { httpStatus } from "../../helpers/httpStatus";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const handleWebhookEvent = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig as string,
    // config.STRIPE_WEBHOOK_SECRET as string
    "whsec_d02a8e43eb18b9d3a1a555d5cacf04c8bb6a358e91cbfc4ea340573df9579ab1"
  );

  const result = await PaymentService.handleWebhookEvent(event);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment successfully",
    data: result,
  });
});

export const PaymentController = {
  handleWebhookEvent,
};