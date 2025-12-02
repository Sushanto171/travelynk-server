/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { httpStatus } from "../../helpers/httpStatus"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { PlanJoinService } from "./plan-join.service"


const requestToJoin = catchAsync(async (req, res) => {
  await PlanJoinService.requestToJoin(req.user!, req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Plan deleted successfully",
    data: null
  })
})

const getMyRequestedPlan = catchAsync(async (req, res) => {
  const result = await PlanJoinService.getMyRequestedPlan(req.user!)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Plan deleted successfully",
    data: result
  })
})

export const PlanJoinController = {
  requestToJoin,
  getMyRequestedPlan
}